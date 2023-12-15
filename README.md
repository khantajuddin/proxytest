# Pupose
To check broken links and redirect links some url does not allow crawling as those servers have cors enabled. so to avoid that we have created proxy url which removes the cors issue.

## Demo
https://proxytest-sigma.vercel.app/api/location?url="your-url-here"

## How to Install
Clone the repository and run `npm install`

## How to Run
run `npm run dev`

## Where it is hosted
It is hosted as vercel edge function, you would need node server to host it

## what to modify
only file you need to worry about is `pages/api/location.js`