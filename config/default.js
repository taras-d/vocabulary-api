
module.exports = {
  "host": "localhost",
  "port": process.env.PORT || 3030,
  "public": "../public/",
  "paginate": {
    "default": 10,
    "max": 50
  },
  "authentication": {
    "secret": "18bf4feeaeb1be2f010880a50f7fa7cdd1c1586bad2c8e1ef2b0771e4906d1fd44a3f8d5883e7ddb786527f049b80792b752637a05438711c5920d85474b4354acaeb525b0f220cb85cbffe48bca1c821230c49f0c0d5c2884fb9d79906a4695a40e4416cff483d59ea9e9532a8bfc061189166eb554fd425d78798447e415b5b0d154c34662a14963efeb01efd891447eaeb68e84d0d1e469a559b254fa5320336fb66842480ce53841cd6e31034a408df1d27aec50f068524e9372eddc0234b31e0e7dea9c31e761066c645427cc1f6f32e68378596700a607e73b46c8eb920a4db4e640fe178fbe9c9b263331c152e51b17c0c9ea71b23aa29e809944c884",
    "strategies": [
      "jwt",
      "local"
    ],
    "path": "/authentication",
    "service": "users",
    "jwt": {
      "header": {
        "typ": "access"
      },
      "audience": "https://yourdomain.com",
      "subject": "anonymous",
      "issuer": "feathers",
      "algorithm": "HS256",
      "expiresIn": "1d"
    },
    "local": {
      "entity": "user",
      "usernameField": "email",
      "passwordField": "password"
    }
  },
  "mongodb": process.env.MONGODB_URL
}
