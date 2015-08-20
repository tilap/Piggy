import Service from 'piggy-module/lib/Service';

export default class SourceService extends Service{

  constructor(manager) {
    super(manager);
  }

  // Create a Source and add created_at / updated_at properties
  createNewOne(data) {
    data.created_at = new Date();
    data.updated_at = new Date();
    return super.createOneFromData(data);
  }

  // Update a Source and update updated_at property
  updateOneFromData(data, id) {
    data.updated_at = new Date();
    return super.updateOneFromData(data, id);
  }

}
