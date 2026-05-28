const apiForm = document.querySelector("form[data-api]");
const whatsappForm = document.querySelector("form[data-whatsapp]");
const clickableSelector = "a, button, .card, .price-card, .feature-list div, .logo-click";

document.querySelectorAll(clickableSelector).forEach((element) => {
    element.classList.add("click-effect");
    element.addEventListener("click", () => {
        element.classList.remove("click-pop", "logo-pulse");
        void element.offsetWidth;
        element.classList.add(element.classList.contains("logo-click") ? "logo-pulse" : "click-pop");
    });
});

if (apiForm) {
    apiForm.insertAdjacentHTML("afterbegin", '<div class="form-message full" hidden></div>');
    const message = apiForm.querySelector(".form-message");
    const button = apiForm.querySelector('button[type="submit"]');

    apiForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(apiForm);
        const payload = Object.fromEntries(formData.entries());

        button.disabled = true;
        button.textContent = "Mengirim...";
        message.hidden = true;

        try {
            const response = await fetch(apiForm.dataset.api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            message.textContent = result.message || "Pesanan diproses.";
            message.className = `form-message ${result.success ? "success" : "error"}`;
            message.hidden = false;

            if (result.success) {
                apiForm.reset();
            }
        } catch (error) {
            message.textContent = "API belum bisa diakses. Jalankan lewat XAMPP/Laragon untuk submit pesanan.";
            message.className = "form-message error";
            message.hidden = false;
        } finally {
            button.disabled = false;
            button.textContent = "Kirim Pesanan";
        }
    });
}

if (whatsappForm) {
    whatsappForm.insertAdjacentHTML("afterbegin", '<div class="form-message full" hidden></div>');
    const message = whatsappForm.querySelector(".form-message");

    whatsappForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = Object.fromEntries(new FormData(whatsappForm).entries());
        const phone = whatsappForm.dataset.whatsapp;
        const text = [
            "Halo admin Jokicoy, saya ingin pesan jasa tugas.",
            "",
            `Nama: ${data.name || "-"}`,
            `WhatsApp: ${data.whatsapp || "-"}`,
            `Email: ${data.email || "-"}`,
            `Jenis tugas: ${data.task_type || "-"}`,
            `Jenjang: ${data.education_level || "-"}`,
            `Deadline: ${data.deadline || "-"}`,
            `Budget: ${data.budget || "-"}`,
            `Catatan: ${data.notes || "-"}`
        ].join("\n");

        message.textContent = "Membuka WhatsApp untuk mengirim pesanan...";
        message.className = "form-message success full";
        message.hidden = false;

        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
    });
}
