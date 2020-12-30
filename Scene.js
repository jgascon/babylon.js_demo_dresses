/*
   Copyright 2020 Jorge Gascon Perez <jorge.gascon.perez@gmail.com>
*/


class Scene {

    selected_meshes_ids = new Set();

    canvas = null;

    engine = null;

    scene = null;

    camera = null;



    constructor(canvas_id) {
        this.clear();
        this.canvas = document.getElementById(canvas_id);

        if (this.canvas) {

            this.engine = new BABYLON.Engine(this.canvas,
                                             true,
                                             {
                                                preserveDrawingBuffer: true,
                                                stencil: true
                                             });

        } else { //if (!this.canvas)

            //Engine that does not require WebGL, used for testing and server-side purposes.
            //More information at: https://doc.babylonjs.com/features/nullengine
            this.engine = new BABYLON.NullEngine();

        } //if (this.canvas)

        //Assertive programming: If something critical fails, the program is killed:
        //"Dead programs tell no lies" (from the Book "The pragmatic Programmer").
        if (!this.engine) {
            let error_text = "ERROR Creating Babylon engine";
            if (typeof module === 'undefined') {
                console.error(error_text);
                console.trace();
                alert(error_text + "\n(more details in 'Developer Tools --> Console')");
            } //if (typeof module === 'undefined') {
            throw error_text;
        } //if (!this.engine)

        this.scene = new BABYLON.Scene(this.engine);

        if (!this.scene) {
            let error_text = "ERROR Creating Babylon scene";
            if (typeof module === 'undefined') {
                console.error(error_text);
                console.trace();
                alert(error_text + "\n(more details in 'Developer Tools --> Console')");
            } //if (typeof module === 'undefined')
            throw error_text;
        } //if (!this.scene)

        this.scene.clearColor = BABYLON.Color3.Black();

        this.camera = new BABYLON.ArcRotateCamera("Camera",
                                                  Math.PI / 2, 1.6, 5,
                                                  new BABYLON.Vector3(0, 2, 0),
                                                  this.scene);
        this.camera.allowUpsideDown = false;
        this.camera.wheelPrecision = 150;
        this.camera.minZ = 0.01;

        if (this.canvas) {
            this.camera.attachControl(this.canvas, true);
        } //if (this.canvas)

        //TODO: Setting the lights and the Skybox, this code should be in another place.

        //~ var hdrTexture = new BABYLON.CubeTexture("images/Studio_Softbox_2Umbrellas_cube_specular.env",
                                                 //~ this.scene);
        //~ hdrTexture.gammaSpace = false;
        //~ this.scene.environmentTexture = hdrTexture;

        var light = new BABYLON.HemisphericLight("light1",
                                                 new BABYLON.Vector3(2, 2, 5),
                                                 this.scene);
        light.intensity = 3;

        // Environment Texture
        var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("images/environment.dds",
                                                                       this.scene);

        this.scene.imageProcessingConfiguration.exposure = 0.6;
        this.scene.imageProcessingConfiguration.contrast = 1.6;

        // Skybox
        var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, this.scene);
        var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", this.scene);
        hdrSkyboxMaterial.backFaceCulling = false;
        hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
        hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        hdrSkyboxMaterial.microSurface = 1.0;
        hdrSkyboxMaterial.disableLighting = true;
        hdrSkybox.material = hdrSkyboxMaterial;
        hdrSkybox.infiniteDistance = true;
    } //constructor(canvas_id)




    clear() {
        this.selected_meshes_ids.clear();
        this.canvas = null;
        this.engine = null;
        this.scene = null;
        this.camera = null;
    } //clear()




    connect_render_loop(a_function) {
        this.engine.runRenderLoop(a_function);
    } //connect_render_loop(a_function)




    render() {
        this.scene.render();
    } //render()




    resize() {
        this.engine.resize();
    } //resize()




    load_model(filename) {
        let my_this = this;
        BABYLON.SceneLoader.ImportMesh("",
                                       "",
                                       filename,
                                       this.scene,
                                       function (meshes) {
                                            for (var i=0; i<meshes.length; i++) {
                                                let mesh = meshes[i];

                                                if (mesh.id == '__root__') {
                                                    continue;
                                                } //if (mesh.id == '__root__')

                                                my_this.set_mesh_as_selectable(mesh);
                                            } //for (var i=0; i<meshes.length; i++)
                                       } //function (meshes)
                                      ); //BABYLON.SceneLoader.ImportMesh(
    } //load_model(filename)




    set_mesh_as_selectable(mesh) {
        if (!mesh) {
            return;
        } //if (!mesh)

        let mesh_id = mesh.id;

        LOG(mesh_id);

        mesh.actionManager = new BABYLON.ActionManager(this.scene);

        let my_this = this;

        mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPickTrigger, //trigger
                    function (event) {
                        let mesh = event.meshUnderPointer;
                        my_this.selected_meshes_ids.add(mesh.id);
                        LOG('Selected ['+mesh.id+']');
                        mesh.showBoundingBox = true;
                    } //function (event)
                ) //new BABYLON.ExecuteCodeAction(
        ).then(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPickTrigger, //trigger
                    function (event) {
                        let mesh = event.meshUnderPointer;
                        my_this.selected_meshes_ids.delete(mesh.id);
                        LOG('DeSelected ['+mesh.id+']');
                        mesh.showBoundingBox = false;
                    } //function (event)
                ) //new BABYLON.ExecuteCodeAction(
        ); //mesh.actionManager.registerAction(
    } //set_mesh_as_selectable(mesh)




    set_texture_to_selected_meshes(texture_url) {
        let mesh;
        let old_mat;
        let new_mat;
        let new_mat_id;

        for (let mesh_id of this.selected_meshes_ids) {
            mesh = this.scene.getMeshByID(mesh_id);

            if (!mesh) {
                continue;
            } //if (!mesh)

            LOG('Setting to ['+mesh_id+'] texture ['+texture_url+']');

            //TODO: use (or generate) a "material_id" more elegant than with texture_url:
            new_mat_id = texture_url;

            new_mat = this.scene.getMaterialByID(new_mat_id);

            if (!new_mat) {
                LOG("Creating new material ["+new_mat_id+"]");

                if (mesh.material) {
                    //A fast way to create a material with the most similar properties
                    //to the existing one.
                    new_mat = mesh.material.clone(new_mat_id);

                } else { //if (!mesh.material)

                    //Creating a sort-of matte material.
                    new_mat = new BABYLON.PBRMaterial(new_mat_id, this.scene);
                    new_mat.albedoColor = BABYLON.Color3.White();
                    //new_mat.reflectionTexture = this.scene.getMaterialByID("skyBox").reflectionTexture.clone();
                    new_mat.microSurface = 0.96;
                    new_mat.albedoColor = BABYLON.Color3.White();
                    new_mat.reflectivityColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                } //if (mesh.material)

                //No need to call the next function (the new material is added to the scene automatically).
                //this.scene.addMaterial(new_mat);

                //Another way to create a new material.
                //~ new_mat = new BABYLON.StandardMaterial(new_mat_id, this.scene);

                //Looking for if this texture is already loaded in the scene.
                let new_texture = null;
                this.scene.textures.forEach(
                    function(texture) {
                        if (texture.url == texture_url) {
                            new_texture = texture;
                            return;
                        } //if (texture.url == texture_url)
                    } //function(texture)
                ); //this.scene.textures.forEach

                if (!new_texture) {
                    LOG("Creating new texture ["+texture_url+"]");
                    new_texture = new BABYLON.Texture(texture_url, this.scene);
//OJO: Put this line, otherwise the texture will be incorrect.
                    new_texture.vScale = -1;
                    //new_texture.invertY = true;
                } //if (!new_texture)

                new_mat.albedoTexture = new_texture;
            } //if (!new_mat)

//BUG?: The newly asigned material/texture do not use the model's UV texture coords, Is it a bug of Babylon?

            old_mat = mesh.material;

            if (old_mat && old_mat.id != new_mat.id) {
                mesh.material = null;
                old_mat.unbind();

                //Unused materials are deleted
                if (old_mat.getBindedMeshes().length == 0) {
                    LOG("Deleting old material ["+old_mat.id+"]");
                    old_mat.dispose(true, true, true); //(forceDisposeEffect, forceDisposeTextures, notBoundToMesh)

//FIXME: Are orphan textures actually deleted?

                } //if (old_mat.getBindedMeshes.length == 0)
            } //if (old_mat && old_mat.id != new_mat.id)

            LOG("Materials in scene ["+this.scene.materials.length+"]");
            LOG("Textures in scene ["+this.scene.textures.length+"]");
            mesh.material = new_mat;

        } //for (let mesh_id of this.selected_meshes_ids)

    } //set_texture_to_selected_meshes(texture_url)

} //class Scene




if (typeof module !== 'undefined') {
    module.exports = Scene;
} //if (typeof module !== 'undefined')
