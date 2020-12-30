/*
   Copyright 2020 Jorge Gascon Perez <jorge.gascon.perez@gmail.com>
*/



//Auxiliar method required by the images/textures of "Textures_List":

function texture_drag(ev) {
    ev.dataTransfer.setData("url", ev.target.src);
} //function texture_drag(ev)





class Textures_List {

    urls = new Set();

    img_template = '<img id="#ID#" src="#SRC#" draggable="true" ondragstart="texture_drag(event)">';

    my_div = null;


    //Assertive programming: If something critical fails, the program is killed:
    //"Dead programs tell no lies" (from the Book "The pragmatic Programmer").

    aux_check_if_correctly_initialized() {
        //NOTE: This method should be private (putting a # as prefix to mark it as private)
        //      But Firefox does not support private methods/attributes yet.
        let error_text = false;

        if (!this.my_div) {
            error_text = "ERROR: Please put in the constructor of 'Textures_List' a valid id of a div."
        } //if (!this.my_div)

        if (error_text) {
            if (typeof module === 'undefined') {
                console.error(error_text);
                console.trace();
                alert(error_text + "\n(more details in 'Developer Tools --> Console')");
            } //if (typeof module === 'undefined')
            throw error_text;
        } //if (error_text)
    } //aux_check_if_correctly_initialized()



    constructor(div_id) {
        this.clear();
        this.my_div = document.getElementById(div_id);
        this.aux_check_if_correctly_initialized();
    } //constructor(div_id)



    add(img_url) {
        this.aux_check_if_correctly_initialized();

        if (this.urls.has(img_url)) {
            return;
        } //if (this.urls.has(img_url))

        this.urls.add(img_url);

        //Adding a new image (generating html from the template):
        let new_img_html = this.img_template;
        //TODO: Use a more elegant ID for the image, now it is the url (in the future should be a hash code)
        new_img_html = new_img_html.replace(/#ID#/g, img_url);
        new_img_html = new_img_html.replace(/#SRC#/g, img_url);

        if (this.my_div) {
            //This method is reported to be faster than adding image with "appendChild".
            this.my_div.innerHTML += new_img_html;
        } //if (this.my_div)
    } //add(img_url)



    remove(img_url) {
        if (!this.urls.has(img_url)) {
            return;
        } //if (!this.urls.has(img_url))

        this.aux_check_if_correctly_initialized();

        this.urls.delete(img_url);

        //Removing the image (its url is also its id: not very elegant but it works)
        let child = document.getElementById(img_url);
        if (child) {
            this.my_div.removeChild(child);
        } //if (child)
    } //remove(img_url)



    clear() {
        this.urls.clear();

        if (this.my_div) {
            this.my_div.innerHTML = '';
        } //if (this.my_div)
    } //clear()

} //class Textures_List





if (typeof module !== 'undefined') {
    module.exports = Textures_List;
} //if (typeof module !== 'undefined')
