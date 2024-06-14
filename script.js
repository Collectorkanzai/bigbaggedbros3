document.addEventListener('DOMContentLoaded', function() {
    const canvas = new fabric.Canvas('canvas');
    const upload = document.getElementById('upload');
    const saveButton = document.getElementById('save');
    let baseImage = null;
    let logoeyes = null;

    // Function to handle image upload
    upload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(f) {
            const imgElement = new Image();
            imgElement.src = f.target.result;
            
            imgElement.onload = function() {
                const maxImageWidth = 800; // Adjust this value as needed
                const maxImageHeight = 600; // Adjust this value as needed

                // Calculate scaled dimensions to fit within canvas
                let scaleX = 1;
                let scaleY = 1;
                if (imgElement.width > maxImageWidth) {
                    scaleX = maxImageWidth / imgElement.width;
                }
                if (imgElement.height > maxImageHeight) {
                    scaleY = maxImageHeight / imgElement.height;
                }
                const scale = Math.min(scaleX, scaleY);

                const imgInstance = new fabric.Image(imgElement, {
                    left: 0,
                    top: 0,
                    scaleX: scale,
                    scaleY: scale,
                    selectable: false
                });

                canvas.clear();
                canvas.setWidth(imgInstance.width * scale);
                canvas.setHeight(imgInstance.height * scale);
                canvas.add(imgInstance);
                baseImage = imgInstance;

                // Add logoeyes as an overlay
                fabric.Image.fromURL('images/logoeyes.png', function(img) {
                    img.scale(0.5 * scale);
                    img.set({
                        left: 100 * scale,
                        top: 100 * scale,
                        selectable: true // Allow selection
                    });
                    canvas.add(img);
                    logoeyes = img;
                });
            }
        }
        
        reader.readAsDataURL(file);
    });

    // Function to save the meme
    saveButton.addEventListener('click', function() {
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1
        });

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'meme.png';
        link.click();
    });

    // Enable object manipulation
    canvas.on('object:selected', function(e) {
        const obj = e.target;
        if (obj === logoeyes) {
            obj.set({
                borderColor: '#FF0000',
                cornerColor: '#FF0000',
                cornerStrokeColor: '#FF0000'
            });
        }
    });

    canvas.on('selection:cleared', function(e) {
        const obj = e.target;
        if (obj === logoeyes) {
            logoeyes.set({
                borderColor: 'transparent',
                cornerColor: 'transparent',
                cornerStrokeColor: 'transparent'
            });
        }
    });

    canvas.on('object:scaling', function(e) {
        const obj = e.target;
        obj.setCoords();
    });

    canvas.on('selection:updated', function(e) {
        const obj = e.target;
        if (obj === logoeyes) {
            logoeyes = obj;
        }
    });

});
