import Store, { CacheHandler } from '@ember-data/store';
import RequestManager from '@ember-data/request';
import Fetch from '@ember-data/request/fetch';
import Cache from '@ember-data/json-api';
import { TrackedObject } from 'tracked-built-ins';

class CustomSchemas {
  schemas = {
    articles: {
      relationships: {
        author: {
          name: 'author',
          kind: 'belongsTo',
          type: 'people',
          options: {
            async: false,
            inverse: null,
          },
        },
        comments: {
          name: 'comments',
          kind: 'hasMany',
          type: 'comments',
          options: {
            async: false,
            inverse: null,
          },
        },
      },
    },
    comments: {
      relationships: {
        author: {
          name: 'author',
          kind: 'belongsTo',
          type: 'people',
          options: {
            async: false,
            inverse: null,
          },
        },
      },
    },
    people: {},
  };

  attributesDefinitionFor(identifier) {
    return this.schemas[identifier.type]?.attributes ?? {};
  }

  doesTypeExist(type) {
    return Boolean(this.schemas[type]);
  }

  relationshipsDefinitionFor(identifier) {
    return this.schemas[identifier.type]?.relationships ?? {};
  }
}

export default class extends Store {
  requestManager = new RequestManager();

  constructor(args) {
    super(args);
    this.requestManager.use([Fetch]);
    this.requestManager.useCache(CacheHandler);
    this.registerSchemaDefinitionService(new CustomSchemas());
  }

  createCache(wrapper) {
    return new Cache(wrapper);
  }

  _instantiateRelationships(identifier) {
    const { cache, schema } = this;

    const relationships = {};
    for (const definition of Object.values(
      schema.relationshipsDefinitionFor(identifier)
    )) {
      const { data } = cache.getRelationship(identifier, definition.name);

      relationships[definition.name] =
        definition.kind === 'hasMany'
          ? data.map((identifier) => this.instantiateRecord(identifier))
          : this.instantiateRecord(data);
    }

    return relationships;
  }

  instantiateRecord(identifier) {
    const { cache, notifications } = this;
    const { type, id } = identifier;

    // create a TrackedObject with our attributes, id and type
    const attrs = cache.peek(identifier).attributes;
    const relationships = this._instantiateRelationships(identifier);

    const data = {
      ...attrs,
      ...relationships,
      ...{ type, id },
    };
    const record = new TrackedObject(data);

    // update the TrackedObject whenever attributes change
    const token = notifications.subscribe(identifier, (_, change) => {
      if (change === 'attributes') {
        Object.assign(record, cache.peek(identifier).attributes);
      }
    });

    // setup the ability to teardown the subscription when the
    // record is no longer needed
    record.destroy = () => {
      this.notifications.unsubscribe(token);
    };

    return record;
  }

  teardownRecord(record) {
    record.destroy();
  }
}
