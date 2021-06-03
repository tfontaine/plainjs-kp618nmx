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
  <button id="Clear">Clear</button>
  <div class="">
    <div id="pred-result" class="hidden"></div>
    <div id="pred-result1" class="hidden"></div>
  </div>`;


class BelleAcneAnalyzer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.fileDrag = null;
    this.fileUpload= null;

    this.imagePreview = null;
    this.imagePreview2 = null;
    this.uploadCaption = null;

    this.predResult = null;
    this.predResult1 = null;
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.fileDrag = this.shadowRoot.getElementById("file-drag");
    this.fileUpload = this.shadowRoot.getElementById("file-upload");

    this.fileDrag.addEventListener("dragover", this.fileDragHover.bind(this), false);
    this.fileDrag.addEventListener("dragleave", this.fileDragHover.bind(this), false);
    this.fileDrag.addEventListener("drop", this.fileUploadHandler.bind(this), false);
    this.fileUpload.addEventListener("change", this.fileUploadHandler.bind(this), false); 
 
    this.shadowRoot.getElementById("Submit").addEventListener("click", this.submitImage.bind(this), false);
    this.shadowRoot.getElementById("Clear").addEventListener("click", this.clearImage.bind(this), false);

    this.imagePreview = this.shadowRoot.getElementById("image-preview");
    this.imagePreview2 = this.shadowRoot.getElementById("image-preview2");
    this.uploadCaption = this.shadowRoot.getElementById("upload-caption");

    this.predResult = this.shadowRoot.getElementById("pred-result");
    this.predResult1 = this.shadowRoot.getElementById("pred-result1");
  }

  disconnectedCallback() {
    this.fileDrag.removeEventListener("dragover", this.fileDragHover.bind(this));
    this.fileDrag.removeEventListener("dragleave", this.fileDragHover.bind(this));
    this.fileDrag.removeEventListener("drop", this.fileUploadHandler.bind(this));
    this.fileUpload.removeEventListener("change", this.fileUploadHandler.bind(this));

    this.shadowRoot.getElementById("Submit").submitImage.removeEventListener("click", this.submitImage.bind(this));
    this.shadowRoot.getElementById("Clear").removeEventListener("click", this.clearImage.bind(this));
  }

  fileDragHover(event) {
    event.preventDefault();
    event.stopPropagation();

    this.fileDrag.className = event.type === "dragover" ? "upload-box dragover" : "upload-box";
  }

  fileUploadHandler(event) {
    var files = event.target.files || event.dataTransfer.files;
    this.fileDragHover(event);
    for (var i = 0, file; (file = files[i]); i++) {
      this.previewFile(file);
    }
  }

  submitImage() {
    if (!this.imagePreview2.src || !this.imagePreview2.src.startsWith("data")) {
      window.alert("Please select an image before submit.");
      return;
    }

    this.predictImage(this.imagePreview2.src);
  }

  clearImage() {
    this.fileUpload.value = "";

    this.imagePreview.src = "";
    this.imagePreview2.src = "";
    this.predResult.innerHTML = "";
    this.predResult1.innerHTML = "";

    this.hide(this.imagePreview);

    this.hide(this.predResult);
    this.hide(this.predResult1);
    this.show(this.uploadCaption);
  }

  previewFile(file) {
    var fileName = encodeURI(file.name);

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imagePreview2.src = URL.createObjectURL(file);

      this.show(this.imagePreview);
      this.hide(this.uploadCaption);
  
      this.displayImage(reader.result, "image-preview");
      this.imagePreview2.src = reader.result;
    };
  }

  displayImage(image, id) {
    var display = this.shadowRoot.getElementById(id);
    display.src = image;

    this.show(display);
  }

  predictImage(image) {
    this.predResult.innerHTML = "predicting...";
    this.show(this.predResult);

    fetch("https://diseases.skinai.net/predict_torus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(image)
    })
      .then(resp => {
        if (resp.ok) {
          resp.json().then(data => {
            this.displayResult(data);
          });
        }
      })
      .catch(err => {
        console.log("An error occured", err.message);
        window.alert("Oops! Something went wrong.");
      });
  }

  displayResult(data) {
    if (data.error == 1) {
      this.predResult.innerHTML = data.msg;
    } else {
      this.predResult.innerHTML = data.result1;
      this.predResult1.innerHTML = data.result2;
    }

    this.show(this.predResult);
    this.show(this.predResult1);
}

  hide(el) {
    el.classList.add("hidden");
  }

  show(el) {
    el.classList.remove("hidden");
  }
}

customElements.define("belle-acne-analyzer", BelleAcneAnalyzer);
