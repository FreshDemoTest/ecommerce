## Commerce Template

First, set up your environmental variables:

- Make a copy from the template 

```sh
cd apps/`current_app`/
cp env.template .env.local
```

- Update with the correspondent values:

```sh
# Public Envs
NEXT_PUBLIC_PROJECT_URL="http://localhost:3000"
NEXT_PUBLIC_SELLER_NAME="Seller Name"
NEXT_PUBLIC_SELLER_LOGO="/logo.png" # it needs to have `logo`.png & `logo`_icon.png
NEXT_PUBLIC_BANNER_IMG="/assets/banner.png"
NEXT_PUBLIC_BANNER_IMG_HREF="/catalog/list"
NEXT_PUBLIC_CATEGORIES="Product 1 category,Product 2 category"
NEXT_PUBLIC_REC_PRODS="1,2,3"
NEXT_PUBLIC_STYLES_JSON='{}'
# Shipping
NEXT_PUBLIC_SHIPPING_ENABLED="true"
NEXT_PUBLIC_SHIPPING_RULE_VERIFIED_BY="minThreshold"
NEXT_PUBLIC_SHIPPING_THRESHOLD=2000
NEXT_PUBLIC_SHIPPING_COST=50
# -- Website copies
NEXT_PUBLIC_SEARCH_PLACEHOLDER="¿Qué estás buscando?"
NEXT_PUBLIC_FOOTER_MSG="¿Listo para comprar?"
NEXT_PUBLIC_FOOTER_CTA="¡Crea tu cuenta!"
NEXT_PUBLIC_FOOTER_PHONE="123456789"
NEXT_PUBLIC_FOOTER_IS_WA="true"
NEXT_PUBLIC_FOOTER_EMAIL="hola@alima.la"
# -- Metadata
NEXT_PUBLIC_SEO_TITLE="Commerce Template"
NEXT_PUBLIC_SEO_DESCRIPTION="B2B Commerce Template by Alima"
NEXT_PUBLIC_SEO_KEYWORDS="ecommerce,b2b,comida,distribuidor"
NEXT_PUBLIC_SEO_IMAGE="/logo.png"

# Private Envs
NEXT_PUBLIC_SELLER_ID="sellerId"  # seller id generated in DB
NEXT_PUBLIC_SUNIT_ID="sunitId" # default supplier unit
NEXT_PUBLIC_COMMERCE_DISPLAY="open"  # type of display of ecommerce
NEXT_PUBLIC_ACCOUNT_ACTIVE="true"  # active or inactive
NEXT_PUBLIC_CURRENCY="MXN"  # currency 
# API environment: staging | production
NEXT_PUBLIC_GQLAPI_ENV="staging"
```

_*Note: make sure to generate the Styles JSON env var correctly, as follows:_

```json
// Create a stringifyied version of this JSON
{
    "palette": {
        "primary": "#15430F",
        "secondary": "#FEEA9A",
        "info": "#F59D5D",
        "success": "#54D62C",
        "warning": "#FFC107",
        "error": "#FF4842"
        },
    "shape": {
        "borderRadius": 8, 
        "borderRadiusSm": 12, 
        "borderRadiusMd": 16
        },
    "type": "Roboto"
}
```

Second, run the development server:

```bash
cd alima-nextjs-monorepo/
pnpm dev --filter `current_app`
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

Deployment is handled project by project in Vercel, once is pushed to its corresponding branch (`main`, `staging`).

Each project needs to configure its first deployment & its corresponding environment.

- Go to [Vercel](https://vercel.com) and find the `alima-nextjs-monorepo`
- [TODO] Your recently pushed app should be listed in the Overview
- Configure correspondent Env variables for that seller.
- Press `deploy` and you are ready to go.