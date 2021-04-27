function qlikRequestTemplatesData(app) {
  return new Promise((resolve) => { app.getList('BookmarkList', resolve); });
}

function processTemplate(bookmark) {
  return {
    label: bookmark.qData.title,
    description: bookmark.qData.description,
    id: bookmark.qInfo.qId,
  };
}

function processTemplatesRawData(response) {
  const data = response.qBookmarkList.qItems.map(processTemplate);
  return data;
}

export async function qlikRequestTemplates(app) {
  const data = await qlikRequestTemplatesData(app)
    .then(processTemplatesRawData);
  return data;
}

export async function qlikRequestApplyTemplate(app, { id }) {
  const status = await app.bookmark.apply(id);
  return status;
}

export async function qlikRequestCreateTemplate(app, { name, description }) {
  const status = await app.bookmark.create(name, description);
  return status.id;
}

export async function qlikRequestRemoveTemplate(app, { id }) {
  const status = await app.bookmark.remove(id);
  return status;
}
