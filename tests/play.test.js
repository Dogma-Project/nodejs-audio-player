const DogmaPlayer = require("../index");

test("test", () => {
    const player = new DogmaPlayer();
    player.play("http://online.radiorelax.ua/RadioRelax_Instrumental_Live");
    expect(player.state).toBe(1);
    
})