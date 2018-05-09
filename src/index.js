import { data, methods } from "menhera-utils";
import { $, $set } from "menhera";
import uuid from "uuid";

export default {
  name: "engine",
  _hooks: {
    data,
    methods,
    ECS: {
      _({ _val }) {
        const { tick = 1000, run } = _val;
        if (run) {
          setInterval(() => {
            this.update();
          }, tick);
        }
      }
    },
    system: {
      _({ cp }) {
        $set(cp, {
          engine: this
        });
        this.systems.add(cp);
      },
      methods
    },
    entity: {
      _({ cp, _val }) {
        const { components } = _val;
        let entity = {};
        $set(entity, {
          uuid: uuid.v1()
        });
        $(components, (k, v) => {
          $set(entity, { [k]: v });
          this.addComponent(k, entity.uuid);
        });
        this.entities.set(entity.uuid, entity);
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
      this.systems.forEach(s => s.update(this));
    },
    addComponent(name, entity) {
      if (!this.components.has(name)) this.components.set(name, new Set());
      this.components.get(name).add(entity);
    },
    find(cps) {
      let valid = true;
      let entities = new Map();
      let components = cps.map(c => this.components.get(c) || (valid = false));

      if (!components || !valid) return [];
      const [filter] = components;

      filter.forEach(id => {
        components.forEach(c => {
          if (!c.has(id)) {
            filter.remove(id);
          }
        });
      });

      filter.forEach(id => {
        entities.set(id, this.entities.get(id));
      });
      return entities;
    }
  }
};
