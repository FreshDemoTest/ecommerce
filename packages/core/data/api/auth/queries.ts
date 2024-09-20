// --------------------------------------------------

export interface GQLEcommerceSession {
  ecommerceUserId?: string;
  sessionData?: string;
  expiration?: Date;
  sessionToken?: string;
  status?: boolean;
  msg?: string;
}

export const getSessionTokenQry = `query getSessionToken($secretKey: String!) {
    getEcommerceSessionToken(refSecretKey: $secretKey) {
      ... on EcommerceSession {
        ecommerceUserId
        sessionData
        expiration
        sessionToken
        status
        msg
      }
      ... on EcommerceSessionError {
        msg
        code
      }
    }
  }`;

export const getSessionTokenRefreshQry = `query getSessionTokenRefresh($secretKey: String!) {
    getEcommerceSessionToken(refSecretKey: $secretKey, refresh: true) {
      ... on EcommerceSession {
        ecommerceUserId
        sessionData
        expiration
        sessionToken
        status
        msg
      }
      ... on EcommerceSessionError {
        msg
        code
      }
    }
  }`;

// --------------------------------------------------------

export interface GQLEcommerceUserMsg {
  status?: boolean;
  msg?: string;
}

export interface GQLEcommerceUser {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  disabled?: boolean;
  createdAt?: Date;
}

export const isUserLoggedInQry = `query isUserLoggedIn($secretKey: String!) {
    isEcommerceUserLoggedIn(refSecretKey: $secretKey) {
      ... on EcommerceUserMsg {
        status
        msg
      }
      ... on EcommerceUserError {
        msg
        code
      }
    }
  }`;

export const signupUserQry = `mutation signupUser($email: String!, $pwd: String!, $fName: String!, $lName: String!, $phoneNumber: String!, $secretKey: String!, $url: String!) {
    signupEcommerceUser(
      email: $email
      firstName: $fName
      lastName: $lName
      password: $pwd
      phoneNumber: $phoneNumber
      refSecretKey: $secretKey
      refUrl: $url
    ) {
      ... on EcommerceUser {
        id
        email
        firstName
        lastName
        phoneNumber
        disabled
        createdAt
        session {
          sessionToken
          status
          expiration
          msg
        }
      }
      ... on EcommerceUserError {
        msg
        code
      }
    }
  }`;

export const loginUserQry = `mutation loginUser($secretKey: String!, $email: String!, $pwd: String!) {
    loginEcommerceUser(email: $email, password: $pwd, refSecretKey: $secretKey) {
      ... on EcommerceUserError {
        msg
        code
      }
      ... on EcommerceUser {
        id
        email
        firstName
        lastName
        phoneNumber
        session {
          sessionToken
          expiration
          status
          msg
        }
      }
    }
  }`;

export const logoutUserQry = `mutation logoutUser($secretKey: String!) {
    logoutEcommerceUser(refSecretKey: $secretKey) {
      ... on EcommerceUserMsg {
        msg
        status
      }
      ... on EcommerceUserError {
        code
        msg
      }
    }
  }`;

export interface GQLEcommercePassword {
  restoreToken?: string;
  status?: boolean;
  msg?: string;
  ecommerceUserId?: string;
  expiration?: Date;
}

export const sendRestoreCodeQry = `mutation sendRestoreCode($secretKey: String!, $email: String!, $url: String!) {
    postEcommerceSendRestoreCode(email: $email, refSecretKey: $secretKey, url: $url) {
      ... on EcommercePassword {
        restoreToken
        status
        msg
        ecommerceUserId
        expiration
      }
      ... on EcommercePasswordError {
        msg
        code
      }
    }
  }`;

export const resetPasswordQry = `mutation resetPassword($secretKey: String!, $newPwd: String!, $resToken: String!) {
    postEcommerceResetPassword(
      password: $newPwd
      refSecretKey: $secretKey
      restoreToken: $resToken
    ) {
      ... on EcommercePasswordResetMsg {
        msg
        status
      }
      ... on EcommercePasswordError {
        code
        msg
      }
    }
  }`;
