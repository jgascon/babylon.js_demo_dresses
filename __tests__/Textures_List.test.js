
const Textures_List = require("../Textures_List");


describe("Textures List", () => {


    test("create list without giving a <div> id", () => {

        let error_message = '';

        try {
            let textures_list = new Textures_List();
        } catch (error) {
            error_message = error;
            console.log("ERROR ["+error+"]");
        } finally {
            expect(error_message).toBe("ERROR: Please put in the constructor of 'Textures_List' a valid id of a div.");
        }
    });



    test("add an url to the list", () => {
        document.body.innerHTML = `
            <div id="texturesWindow"></div>
        `;

        let textures_list = new Textures_List('texturesWindow');

        textures_list.add("images/aaa.jpg");

        const output = new Set(["images/aaa.jpg"]);

        expect(textures_list.urls).toEqual(output);

        expect(textures_list.my_div.innerHTML).toBe('<img id="images/aaa.jpg" src="images/aaa.jpg" draggable="true" ondragstart="texture_drag(event)">');
    });




    test("add an url twice (it have not to be added the second time)", () => {
        document.body.innerHTML = `
            <div id="texturesWindow"></div>
        `;

        let textures_list = new Textures_List('texturesWindow');

        textures_list.add("images/aaa.jpg");

        //Add the same url second time.
        textures_list.add("images/aaa.jpg");

        const output = new Set(["images/aaa.jpg"]);

        expect(textures_list.urls).toEqual(output);

        expect(textures_list.my_div.innerHTML).toBe('<img id="images/aaa.jpg" src="images/aaa.jpg" draggable="true" ondragstart="texture_drag(event)">');
    });




    test("add two different urls", () => {
        document.body.innerHTML = `
            <div id="texturesWindow"></div>
        `;

        let textures_list = new Textures_List('texturesWindow');

        textures_list.add("images/aaa.jpg");

        textures_list.add("images/bbb.jpg");

        const output = new Set(["images/aaa.jpg", "images/bbb.jpg"]);

        expect(textures_list.urls).toEqual(output);

        const result_html =
            '<img id="images/aaa.jpg" src="images/aaa.jpg" draggable="true" ondragstart="texture_drag(event)">' +
            '<img id="images/bbb.jpg" src="images/bbb.jpg" draggable="true" ondragstart="texture_drag(event)">';

        expect(textures_list.my_div.innerHTML).toBe(result_html);
    });




    test("remove an url (2 urls added previously)", () => {
        document.body.innerHTML = `
            <div id="texturesWindow"></div>
        `;

        let textures_list = new Textures_List('texturesWindow');

        textures_list.add("images/aaa.jpg");

        textures_list.add("images/bbb.jpg");

        textures_list.remove("images/aaa.jpg");

        const output = new Set(["images/bbb.jpg"]);

        expect(textures_list.urls).toEqual(output);

        const result_html =
            '<img id="images/bbb.jpg" src="images/bbb.jpg" draggable="true" ondragstart="texture_drag(event)">';

        expect(textures_list.my_div.innerHTML).toBe(result_html);
    });




    test("remove an url that not exist (2 urls added previously)", () => {
        document.body.innerHTML = `
            <div id="texturesWindow"></div>
        `;

        let textures_list = new Textures_List('texturesWindow');

        textures_list.add("images/aaa.jpg");

        textures_list.add("images/bbb.jpg");

        textures_list.remove("images/ccc.jpg");

        const output = new Set(["images/aaa.jpg", "images/bbb.jpg"]);

        expect(textures_list.urls).toEqual(output);

        const result_html =
            '<img id="images/aaa.jpg" src="images/aaa.jpg" draggable="true" ondragstart="texture_drag(event)">' +
            '<img id="images/bbb.jpg" src="images/bbb.jpg" draggable="true" ondragstart="texture_drag(event)">';

        expect(textures_list.my_div.innerHTML).toBe(result_html);
    });




    test("clear the list of urls", () => {
        document.body.innerHTML = `
            <div id="texturesWindow"></div>
        `;

        let textures_list = new Textures_List('texturesWindow');

        textures_list.add("images/aaa.jpg");

        textures_list.add("images/bbb.jpg");

        textures_list.clear("images/aaa.jpg");

        const output = new Set();

        expect(textures_list.urls).toEqual(output);

        expect(textures_list.my_div.innerHTML).toBe('');
    });




    test("remove an url from empty list", () => {
        document.body.innerHTML = `
            <div id="texturesWindow"></div>
        `;

        let textures_list = new Textures_List('texturesWindow');

        textures_list.remove("images/ccc.jpg");

        const output = new Set();

        expect(textures_list.urls).toEqual(output);

        expect(textures_list.my_div.innerHTML).toBe('');
    });




    test("remove an url from empty list (2 urls added previously)", () => {
        document.body.innerHTML = `
            <div id="texturesWindow"></div>
        `;

        let textures_list = new Textures_List('texturesWindow');

        textures_list.add("images/aaa.jpg");

        textures_list.add("images/bbb.jpg");

        textures_list.clear();

        textures_list.remove("images/ccc.jpg");

        const output = new Set();

        expect(textures_list.urls).toEqual(output);

        expect(textures_list.my_div.innerHTML).toBe('');
    });

});
