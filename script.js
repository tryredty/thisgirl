function playTrack(file, name) {
    let audio = document.getElementById("audio");
    let trackName = document.getElementById("current-track");

    audio.src = file;
    trackName.textContent = "Lecture : " + name;
    audio.play();
}

window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(effect, x, y, color) {
            this.effect = effect;
            this.x = Math.random() * this.effect.canvasWidth;
            this.y = Math.random() * this.effect.canvasHeight;
            this.color = color; // Couleur des particules
            this.originX = x;
            this.originY = y;
            this.size = 1; // Taille des particules
            this.dx = 0;
            this.dy = 0;
            this.vx = 0;
            this.vy = 0;
            this.force = 0;
            this.angle = 0;
            this.distance = 0;
            this.friction = Math.random() * 0.6 + 0.02; // Encore plus fluide
            this.ease = Math.random() * 0.1 + 0.03; // Revient plus vite
        }

        draw() {
            this.effect.context.fillStyle = this.color;
            this.effect.context.fillRect(this.x, this.y, this.size, this.size);
        }

        update() {
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = this.dx * this.dx + this.dy * this.dy;
            this.force = -this.effect.mouse.radius / this.distance;

            if (this.distance < this.effect.mouse.radius) {
                this.angle = Math.atan2(this.dy, this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }

            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
            this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        }
    }

    class Effect {
        constructor(context, canvasWidth, canvasHeight) {
            this.context = context;
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.textX = this.canvasWidth / 2;
            this.textY = this.canvasHeight / 2;
            this.fontSize = 80; // Taille réduite pour le texte affiché
            this.particles = [];
            this.gap = 1; // Ultra haute densité
            this.mouse = {
                radius: 40000, // Interaction plus fluide
                x: undefined,
                y: undefined,
            };

            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            });

            this.createParticles("JE VOUS PRÉSENTE MA CRUSH");
        }

        createParticles(text) {
            console.log("Création des particules...");

            this.context.fillStyle = "white";
            this.context.textAlign = "center";
            this.context.textBaseline = "middle";
            this.context.font = this.fontSize + "px Helvetica";
            this.context.fillText(text, this.textX, this.textY);

            const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data;
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

            for (let y = 0; y < this.canvasHeight; y += this.gap) {
                for (let x = 0; x < this.canvasWidth; x += this.gap) {
                    const index = (y * this.canvasWidth + x) * 4;
                    const alpha = pixels[index + 3];

                    if (alpha > 128) {
                        // Utilisez la couleur rose pour les particules
                        this.particles.push(new Particle(this, x, y, "rgba(255, 20, 147, 0.8)")); // Couleur rose
                    }
                }
            }

            console.log(`${this.particles.length} particules créées.`);
        }

        render() {
            this.particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
        }
    }

    const effect = new Effect(ctx, canvas.width, canvas.height);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.render();
        requestAnimationFrame(animate);
    }

    animate();
});
