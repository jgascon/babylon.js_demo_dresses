
const Scene = require("../Scene");

//npm install --save babylonjs babylonjs-loaders

//Information how to test Babylon.js in Jest:
//https://doc.babylonjs.com/features/nullengine

const BABYLON = require("babylonjs");
const LOADERS = require("babylonjs-loaders");

describe("Textures drag Scene", () => {


    test("Connect render loop, render and resize", () => {

        let scene = new Scene();

        scene.connect_render_loop(
            function () {
                scene.render();
            });

        scene.render();
        scene.resize();
        expect(scene.scene.meshes.length).toBeGreaterThan(0);
    });




    test("Load the model 'aaa.gltf' that does not exist", () => {

        let scene = new Scene();

        scene.load_model("aaa.gltf");

        expect(scene.scene.meshes.length).toBeGreaterThan(0);
    });




    test("Load the model 'Greta.gltf' that actually exists", () => {

        let scene = new Scene();

        scene.load_model("Greta.gltf");

        expect(scene.scene.meshes.length).toBeGreaterThan(0);
    });




    test("Apply texture to no selected mesh", () => {

        let scene = new Scene();

        scene.load_model("Greta.gltf");

        scene.set_texture_to_selected_meshes("images/aaa.jpg");

        expect(scene.scene.meshes.length).toBeGreaterThan(0);
    });




    test("Apply texture to some selected meshes", () => {

        let scene = new Scene();

        scene.load_model("Greta.gltf");

        scene.selected_meshes_ids.add("Hair");
        scene.selected_meshes_ids.add("Skirt");
        scene.selected_meshes_ids.add("Corset");

        scene.set_texture_to_selected_meshes("images/aaa.jpg");

        expect(scene.scene.meshes.length).toBeGreaterThan(0);
    });


});
