import { data, methods } from "menhera-utils";
import { $, $set } from "menhera";
import uuid from "uuid";

export default {
  name: "engine",
  _hooks: {
    data,
    methods,
    system: {
      _({ cp }) {
        $set(cp, {
          engine: this
        });
        this.systems.add(cp);
      }
    },
    entity: {
      _({ cp }) {
        this.entities.set(cp.uuid, cp);
      }
    },
    components: {
      _({ cp, _val: components }) {
        $(components, (k, v) => {
          this.addComponent(k, cp.uuid);
        });
      }
    }
  },
  data: {
    entities: new Map(),
    systems: new Set(),
    components: new Map()
  },
  methods: {
    update() {
      this.systems.forEach(s => s.update());
    },
    addComponent(name, id) {
      if (!this.components.has(name)) this.components.set(name, new Set());
      this.components.get(name).add(id);
    },
    removeComponent(name, id) {
      let cp = this.components.get(name);
      if (cp) {
        cp.delete(id);
      }
    },
    get(cps) {
      let valid = true;
      let entities = new Map();
      let components = cps.map(c => this.components.get(c) || (valid = false));

      if (!components || !valid) return [];
      const [filter] = components;

      filter.forEach(id => {
        components.forEach(c => {
          if (!c.has(id)) {
            filter.delete(id);
          }
        });
      });

      filter.forEach(id => {
        entities.set(id, this.entities.get(id).components);
      });
      return entities;
    }
  }
};
