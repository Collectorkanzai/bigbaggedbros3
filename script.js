document.addEventListener('DOMContentLoaded', function() {
    const canvas = new fabric.Canvas('canvas');
    const upload = document.getElementById('upload');
    const saveButton = document.getElementById('save');
    let baseImage = null;
    let arm2 = null; // Use arm2 for png 2

    // Function to handle image upload
    upload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(f) {
            const imgElement = new Image();
            imgElement.src = f.target.result;
            
            imgElement.onload = function() {
                const maxImageWidth = 400; // Adjust this value as needed
                const maxImageHeight = 400; // Adjust this value as needed

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

                // Add BBB Arms 2 as an overlay
                fabric.Image.fromURL('images/muscular-arm2.png', function(img) {
                    img.scale(0.5 * scale);
                    img.set({
                        left: 100 * scale,
                        top: 100 * scale,
                        selectable: true, // Allow selection
                        opacity: 1  // Ensure opacity is 1
                    });
                    canvas.add(img);
                    arm2 = img;
                });
            }
        }
        
        reader.readAsDataURL(file);
    });

    // Function to save the meme
    saveButton.addEventListener('click', function() {
        canvas.discardActiveObject(); // Deselect any active objects
        
        // Generate image URL from canvas
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1
        });

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'meme.png'; // Set the download attribute
        document.body.appendChild(link); // Append the link to the body
        link.click(); // Programmatically click the link to trigger download
        document.body.removeChild(link); // Clean up: remove the link from the body
    });

    // Event listener to allow manipulation of arm
    canvas.on('object:selected', function(e) {
        const obj = e.target;
        if (obj === arm2) {
            obj.set({
                borderColor: '#FF0000', // Optional: Highlight selected arm
                cornerColor: '#FF0000', // Optional: Highlight selected arm
                cornerStrokeColor: '#FF0000' // Optional: Highlight selected arm
            });
        }
    });

    canvas.on('selection:cleared', function(e) {
        const obj = e.target;
        if (obj === arm2) {
            arm2.set({
                borderColor: 'transparent', // Reset border color
                cornerColor: 'transparent', // Reset corner color
                cornerStrokeColor: 'transparent' // Reset corner stroke color
            });
        }
    });

    canvas.on('object:scaling', function(e) {
        const obj = e.target;
        obj.setCoords(); // Update object's coordinates

        // Limit scaling to avoid arms going out of image bounds
        if (obj.scaleX > obj.maxScaleFactor) {
            obj.scaleX = obj.maxScaleFactor;
        }
        if (obj.scaleY > obj.maxScaleFactor) {
            obj.scaleY = obj.maxScaleFactor;
        }
    });

    canvas.on('selection:updated', function(e) {
        const obj = e.target;
        if (obj === arm2) {
            arm2 = obj; // Update arm2 reference
        }
    });

});
