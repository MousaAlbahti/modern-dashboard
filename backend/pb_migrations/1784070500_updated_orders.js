/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("orders")

  // update collection rules to allow authenticated, verified users
  unmarshal({
    "listRule": "@request.auth.id != \"\" && @request.auth.verified = true",
    "viewRule": "@request.auth.id != \"\" && @request.auth.verified = true",
    "createRule": "@request.auth.id != \"\" && @request.auth.verified = true",
    "updateRule": "@request.auth.id != \"\" && @request.auth.verified = true",
    "deleteRule": "@request.auth.id != \"\" && @request.auth.verified = true"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("orders")

  // revert rules to null (superusers only)
  unmarshal({
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null
  }, collection)

  return app.save(collection)
})
