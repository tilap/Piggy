import Service from 'piggy-module/lib/Service';

export default class {{Nicename}}Service extends Service{

  constructor(manager) {
    super(manager);
  }
{% if example %}
  // Create a {{Nicename}} and add created_at / updated_at properties
  createNewOne(data) {
    data.created_at = new Date();
    data.updated_at = new Date();
    return super.createOneFromData(data);
  }

  // Update a {{Nicename}} and update updated_at property
  updateOneFromData(data, id) {
    data.updated_at = new Date();
    return super.updateOneFromData(data, id);
  }
{% endif %}
}
