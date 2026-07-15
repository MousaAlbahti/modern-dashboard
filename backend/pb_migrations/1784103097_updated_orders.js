/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && @request.auth.verified = true",
    "deleteRule": "@request.auth.id != \"\" && @request.auth.verified = true",
    "listRule": "@request.auth.id != \"\" && @request.auth.verified = true",
    "updateRule": "@request.auth.id != \"\" && @request.auth.verified = true",
    "viewRule": "@request.auth.id != \"\" && @request.auth.verified = true"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
