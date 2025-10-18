This directory exists because the `<Redirecter />` component needs to be able to throw a 404 if a page is declared as not found.

We cannot use the `notFound()` function in the root layout.

The `<body>` tag still needs to be in the root layout.