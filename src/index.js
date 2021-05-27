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

    .upload_box {
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

    .upload_box.dragover {
      color: #eeeeee;
      border: 0.1rem solid rgb(0, 120, 212);
      box-shadow: inset 0 0 0 0.1rem rgb(0, 120, 212);
    }

    .upload_box:hover {
      border-color: rgb(0, 120, 212);
    }

    .upload_box #image_preview {
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
		<input id="file_upload" class="hidden" type="file" accept="*" />
  	<label for="file_upload" id="file_drag" class="upload_box">
    	<div id="upload_caption">Drop image here or click to select</div>
    	<img id="image_preview" class="hidden" />
    	<img id="image_preview2" class="hidden" />
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

    //this.shadowRoot.getElementById("file_drag").addEventListener("dragover", this.fileDragHover, false);
    //this.shadowRoot.getElementById("file_drag").addEventListener("dragleave", this.fileDragHover, false);
    //this.shadowRoot.getElementById("file_drag").addEventListener("drop", this.fileUploadHandler, false);
    //this.shadowRoot.getElementById("file_upload").addEventListener("change", this.fileUploadHandler, false);
    this.shadowRoot.getElementById("file_drag").onDragover = () => this.fileDragHover();
    this.shadowRoot.getElementById("file_drag").onDragleave = () => this.fileDragHover();
    this.shadowRoot.getElementById("file_drag").onDrop = () => this.fileUploadHandler();
    this.shadowRoot.getElementById("file_upload").onChange = () => this.fileUploadHandler();

    this.shadowRoot.getElementById("Submit").onclick = () => this.submitImage();
    this.shadowRoot.getElementById("Clear").onclick = () => this.clearImage();
  }

  fileDragHover(event) {
    event.preventDefault();
    event.stopPropagation();

    this.shadowRoot.getElementById("file_drag").className = event.type === "dragover" ? "upload-box dragover" : "upload-box";
  }

  fileUploadHandler(event) {
    var files = event.target.files || event.dataTransfer.files;
    this.fileDragHover(event);
    for (var i = 0, file; (file = files[i]); i++) {
      previewFile(file);
    }
  }

  submitImage() {
  }

  clearImage() {
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
