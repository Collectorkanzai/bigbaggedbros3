document.addEventListener('DOMContentLoaded', function() {
    const canvas = new fabric.Canvas('canvas');
    const upload = document.getElementById('upload');
    const saveButton = document.getElementById('save');
    let baseImage = null;

    // Function to handle image upload
    upload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(f) {
            const imgElement = new Image();
            imgElement.src = f.target.result;
            
            imgElement.onload = function() {
                const imgInstance = new fabric.Image(imgElement, {
                    left: 0,
                    top: 0,
                    selectable: false
                });
                canvas.clear();
                canvas.setWidth(imgElement.width);
                canvas.setHeight(imgElement.height);
                canvas.add(imgInstance);
                baseImage = imgInstance;

                // Add the first muscular arm image as an overlay
                fabric.Image.fromURL('images/muscular-arm1.png', function(img) {
                    img.scale(0.5);
                    img.set({
                        left: 100,
                        top: 100,
                        selectable: true
                    });
                    canvas.add(img);
                });

                // Add the second muscular arm image as an overlay
                fabric.Image.fromURL('images/muscular-arm2.png', function(img) {
                    img.scale(0.5);
                    img.set({
                        left: 200,
                        top: 100,
                        selectable: true
                    });
                    canvas.add(img);
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
});
