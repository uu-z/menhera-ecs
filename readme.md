## Install

```bash
$ yarn menhera menhera-ecs
```

## Example

```js
import Mhr from "menhera";
import ECS from "menhera-ecs";

let moveSystem = {
  system: {},
  methods: {
    update() {
      let entities = this.engine.get(["Position", "Velocity"]);
      entities.forEach(e => {
        console.log(e);
        e.Position.x += e.Velocity.x;
        e.Position.y += e.Velocity.y;
      });
    }
  }
};

let recycleSystem = {
  system: {},
  methods: {
    update() {
      let entities = this.engine.get(["~Components"]);
      entities.forEach(e => {
        let cps = [...e["~Components"], "~Components"];
        this.engine.removeComponents(cps, e);
      });
    }
  }
};

let Entities1 = {
  entity: {},
  components: {
    Name: "Entities1",
    Position: {
      x: 1,
      y: 1
    },
    Velocity: {
      x: 1,
      y: 1
    }
  }
};

let Entities2 = {
  entity: {},
  components: {
    Name: "Entities2",
    Position: {
      x: 1,
      y: 1
    },
    Velocity: {
      x: 2,
      y: 2
    }
  }
};

Mhr.$use({
  _mount: {
    ECS
  },
  _run: {
    Systems: [moveSystem, recycleSystem],
    Entities: [Entities1, Entities2]
  }
});

setInterval(() => {
  ECS.update();
}, 1000 / 60);
```
