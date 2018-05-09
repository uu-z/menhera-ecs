import Mhr from "menhera";
import ECS from "../src";

let moveSystem = {
  system: {
    methods: {
      update(engine) {
        let entities = engine.find(["Positon", "Velocity"]);
        entities.forEach(e => {
          console.log(e);
          e.Positon.x += e.Velocity.x;
          e.Positon.y += e.Velocity.y;
        });
      }
    }
  }
};

let Entities1 = {
  entity: {
    components: {
      Name: "Entities1",
      Positon: {
        x: 1,
        y: 1
      },
      Velocity: {
        x: 1,
        y: 1
      }
    }
  }
};

let Entities2 = {
  entity: {
    components: {
      Name: "Entities2",
      Positon: {
        x: 1,
        y: 1
      },
      Velocity: {
        x: 2,
        y: 2
      }
    }
  }
};

Mhr.$use({
  _mount: {
    ECS
  },
  _run: {
    moveSystem,
    Entities: [Entities1, Entities2]
  }
}).$use({
  ECS: {
    tick: 100,
    run: true
  }
});
