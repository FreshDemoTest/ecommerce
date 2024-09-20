/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

// consts
export const maxGQLRetries = 3;

export function buildAuthHeaders(
  sellerId: string,
  sessionToken: string
): Record<string, string> {
  const headrs = {
    authorization: `ecbasic-${sellerId} ${sessionToken}`,
  };
  return headrs;
}

interface GraphQLFetchProps {
  graphQLEndpoint: string;
  query: string;
  queryName: string;
  headers?: any;
  variables?: any;
  files?: any;
  retries?: number;
  cache?: RequestCache;
}

export interface GQLError {
  code?: string;
  msg?: string;
}

/**
 * Call GraphQL endpoint via Fetch
 * @param  GraphQLFetchProps
 *  - query: string
 *  - headers?: any
 *  - variables?: any
 * @returns  {data: any, error: any}
 */
export const graphQLFetch = async ({
  graphQLEndpoint,
  query,
  queryName,
  headers = {},
  variables = {},
  cache = undefined,
  retries = 0,
}: GraphQLFetchProps): Promise<{ data: any; error: GQLError }> => {
  // retries validation
  if (retries >= maxGQLRetries) {
    return {
      data: undefined,
      error: {
        code: "M0001",
        msg: "GQL: Max retries exceeded",
      },
    };
  }
  // headers
  const gqlHeaders = new Headers();
  gqlHeaders.append("Content-Type", "application/json");
  gqlHeaders.append("Accept", "application/json");
  if (headers) {
    Object.keys(headers).forEach((key) => {
      gqlHeaders.append(key, headers[key]);
    });
  }
  try {
    // response
    const resp = await fetch(graphQLEndpoint, {
      method: "POST",
      headers: gqlHeaders,
      body: JSON.stringify({
        query,
        variables,
      }),
      cache,
    });
    const data = await resp.json();
    let parsedData = data.data;
    // parse errors
    let err = {};
    if (data.errors) {
      err = {
        code: "M0000",
        msg: (data.errors as any[]).map((e) => e.message).join("\n"),
      };
    }
    if (Object.keys(data.data).includes("code")) {
      err = {
        code: data.data.code,
        msg: data.data?.msg || "",
      };
    } else if (Object.keys(data.data).includes(queryName)) {
      if (data.data[queryName].code) {
        err = {
          code: data.data[queryName].code,
          msg: data.data[queryName].msg,
        };
      } else {
        parsedData = data.data[queryName];
      }
    }
    // build response
    return {
      data: parsedData,
      error: err,
    };
  } catch (error) {
    // connection error
    // eslint-disable-next-line no-console
    console.log(error);
    // fetch again
    return graphQLFetch({
      graphQLEndpoint,
      query,
      queryName,
      variables,
      headers: {
        ...headers,
      },
      retries: retries + 1,
    });
  }
};

/**
 * Call GraphQL endpoint via Fetch with files
 * @param GraphQLFetchProps
 *  - query: string
 *  - headers?: any
 *  - variables?: any
 *  - files?: any
 *     {files: {key: [file, filename]}, map: {key: 'variables.key'}}
 * @returns  {data: any, error: GQLError}
 */
export const graphQLFetchFiles = async ({
  graphQLEndpoint,
  query,
  queryName,
  headers = {},
  variables = {},
  files = {},
}: GraphQLFetchProps): Promise<{
  data: any;
  error: GQLError;
}> => {
  // headers
  const gqlHeaders = new Headers();
  if (headers) {
    Object.keys(headers).forEach((key) => {
      gqlHeaders.append(key, headers[key]);
    });
  }
  // form data
  const formdata = new FormData();
  formdata.append(
    "operations",
    JSON.stringify({
      query,
      variables,
    })
  );
  formdata.append("map", JSON.stringify(files.map));
  Object.keys(files.files).forEach((key) => {
    const _blob = files.files[key][0];
    if (!_blob) return;
    formdata.append(key, _blob, files.files[key][1]);
  });
  // response
  try {
    const resp = await fetch(graphQLEndpoint, {
      method: "POST",
      headers: gqlHeaders,
      body: formdata,
    });
    const data = await resp.json();
    let parsedData = data.data;
    // parse errors
    let err = {};
    if (data.errors) {
      err = {
        code: "M0000",
        msg: (data.errors as any[]).map((e) => e.message).join("\n"),
      };
    }
    if (Object.keys(data.data).includes("code")) {
      err = {
        code: data.data.code,
        msg: data.data?.msg || "",
      };
    } else if (Object.keys(data.data).includes(queryName)) {
      if (data.data[queryName].code) {
        err = {
          code: data.data[queryName].code,
          msg: data.data[queryName].msg,
        };
      } else {
        parsedData = data.data[queryName];
      }
    }
    // build response
    return {
      data: parsedData,
      error: err,
    };
  } catch (error: any) {
    // connection error
    // eslint-disable-next-line no-console
    console.log(error);
    return {
      data: undefined,
      error,
    };
  }
};
