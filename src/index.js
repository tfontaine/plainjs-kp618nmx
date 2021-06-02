const template = document.createElement("template");
template.innerHTML = /*html*/`
  <style>
    .hidden {
      display: none;
    }

    .reveal {
      opacity: 0;
    }

    .reveal:hover {
      opacity: 0.2;
    }

    .upload-box {
      font-size: 1rem;
      color: #666666;
      cursor: pointer;
      width: 25rem;
      height: 15rem;
      background: #fff;
      border: 0.1rem dashed #838388;
      border-radius: 0.4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 1rem 0 2rem 0;
    }

    .upload-box.dragover {
      color: #eeeeee;
      border: 0.1rem solid rgb(0, 120, 212);
      box-shadow: inset 0 0 0 0.1rem rgb(0, 120, 212);
    }

    .upload-box:hover {
      border-color: rgb(0, 120, 212);
    }

    .upload-box #image-preview {
      max-width: 15rem;
      max-height: 15rem;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.19);
    }

    button {
      width: 5rem;
      height: 2rem;
      border: none;
      border-radius: 10px;
      background-color: seagreen;
      color: white;
    }
  </style>

  <div class="panel">
		<input id="file-upload" class="hidden" type="file" accept="*" />
  	<label for="file-upload" id="file-drag" class="upload-box">
    	<div id="upload-caption">Drop image here or click to select</div>
    	<img id="image-preview" class="hidden" />
    	<img id="image-preview2" class="hidden" />
    </label>
  </div>
  <div class="" style="display: inline-block; padding-left: 110px;"></div>
  <button id="Submit">Submit</button>
  <button id="Clear">Clear</button>`;


class BelleAcneAnalyzer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  
    this.shadowRoot.getElementById("file-drag").addEventListener("dragover", this.fileDragHover.bind(this), false);
    this.shadowRoot.getElementById("file-drag").addEventListener("dragleave", this.fileDragHover.bind(this), false);
    this.shadowRoot.getElementById("file-drag").addEventListener("drop", this.fileUploadHandler.bind(this), false);
    this.shadowRoot.getElementById("file-upload").addEventListener("change", this.fileUploadHandler.bind(this), false); 
 
    this.shadowRoot.getElementById("Submit").addEventListener("click", this.submitImage, false);
    this.shadowRoot.getElementById("Clear").addEventListener("click", this.clearImage, false);
  }

  disconnectedCallback() {
    this.shadowRoot.getElementById("file-drag").removeEventListener("dragover", this.fileDragHover.bind(this));
    this.shadowRoot.getElementById("file-drag").removeEventListener("dragleave", this.fileDragHover.bind(this));
    this.shadowRoot.getElementById("file-drag").removeEventListener("drop", this.fileUploadHandler.bind(this));
    this.shadowRoot.getElementById("file-upload").removeEventListener("change", this.fileUploadHandler.bind(this));

    this.shadowRoot.getElementById("Submit").removeEventListener("click", this.submitImage);
    this.shadowRoot.getElementById("Clear").removeEventListener("click", this.clearImage);
  }

  fileDragHover(event) {
    console.log("DRAGOVER");

    event.preventDefault();
    event.stopPropagation();

    this.shadowRoot.getElementById("file-drag").className = event.type === "dragover" ? "upload-box dragover" : "upload-box"; 
  }

  fileUploadHandler(event) {
    console.log("UPLOADHANDLER");
    console.log(this.parentNode);

    var files = event.target.files || event.dataTransfer.files;
    event.preventDefault();
    event.stopPropagation();
    for (var i = 0, file; (file = files[i]); i++) {
      this.previewFile(file);
    }
  }

  fileClick() {
    console.log("ONCLICK");
  }

  submitImage() {
    console.log("SUBMIT");
  }

  clearImage() {
    console.log("CLEAR");
  }

  previewFile(file) {
    var fileName = encodeURI(file.name);

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      imagePreview2.src = URL.createObjectURL(file);

      show(imagePreview);
      hide(uploadCaption);
  
      displayImage(reader.result, "image-preview");
      imagePreview2.src = reader.result;
    };
  }
}

customElements.define("belle-acne-analyzer", BelleAcneAnalyzer);
