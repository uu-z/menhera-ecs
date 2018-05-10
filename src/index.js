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
        cp.components.uuid = cp.uuid;
        this.entities.set(cp.uuid, cp);
      }
    },
    components: {
      _({ _val: e }) {
        this.addComponents(e, e);
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
    addComponents(obj, e) {
      $(obj, (k, v) => {
        this.addComponent(k, v, e);
      });
    },
    addComponent(k, v, e) {
      if (!this.components.has(k)) this.components.set(k, new Set());
      e[k] = v;
      this.components.get(k).add(e.uuid);
    },
    removeComponents(cps, e) {
      cps.forEach(cp => {
        this.removeComponent(cp, e);
      });
    },
    removeComponent(cp, e) {
      let components = this.components.get(cp);
      if (components) {
        if (e[cp]) delete e[cp];
        components.delete(e.uuid);
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
