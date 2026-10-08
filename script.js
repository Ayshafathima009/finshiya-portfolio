document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       CURRENT YEAR
    ========================================= */

    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* =========================================
       NAVBAR
    ========================================= */

    const navbar = document.querySelector(".custom-navbar");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const navbarCollapse = document.getElementById("portfolioNav");

    function updateNavbar() {

        if (!navbar) return;

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    updateNavbar();

    window.addEventListener("scroll", updateNavbar);


    /* =========================================
       MOBILE NAVBAR + SMOOTH SCROLL
    ========================================= */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            /*
             * Fixed navbar height
             * Prevents section heading from hiding
             * behind the navbar.
             */
            const navbarHeight = navbar
                ? navbar.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });


            /*
             * Close mobile navbar after clicking
             */
            if (
                navbarCollapse &&
                navbarCollapse.classList.contains("show") &&
                typeof bootstrap !== "undefined"
            ) {

                const bsCollapse =
                    bootstrap.Collapse.getOrCreateInstance(
                        navbarCollapse
                    );

                bsCollapse.hide();
            }

        });

    });


    /* =========================================
       ACTIVE NAVBAR LINK
    ========================================= */

    const sections = document.querySelectorAll("section[id]");

    function updateActiveNav() {

        const scrollPosition =
            window.scrollY + 150;

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            const href = link.getAttribute("href");

            if (href === `#${currentSection}`) {
                link.classList.add("active");
            }

        });

    }

    updateActiveNav();

    window.addEventListener("scroll", updateActiveNav);


    /* =========================================
       SCROLL TOGGLE BUTTON
       DOWN → NEXT SECTION
       UP → TOP
    ========================================= */

    const scrollToggle =
        document.getElementById("scrollToggle");

    if (scrollToggle) {

        const icon =
            scrollToggle.querySelector("i");

        function updateScrollButton() {

            const scrollTop =
                window.scrollY;

            const windowHeight =
                window.innerHeight;

            const documentHeight =
                document.documentElement.scrollHeight;

            const isAtBottom =
                scrollTop + windowHeight >=
                documentHeight - 100;

            if (isAtBottom) {

                if (icon) {
                    icon.className =
                        "bi bi-arrow-up";
                }

                scrollToggle.setAttribute(
                    "aria-label",
                    "Scroll to Top"
                );

            } else {

                if (icon) {
                    icon.className =
                        "bi bi-arrow-down";
                }

                scrollToggle.setAttribute(
                    "aria-label",
                    "Scroll Down"
                );

            }

        }


        scrollToggle.addEventListener(
            "click",
            function () {

                const scrollTop =
                    window.scrollY;

                const windowHeight =
                    window.innerHeight;

                const documentHeight =
                    document.documentElement.scrollHeight;

                const isAtBottom =
                    scrollTop + windowHeight >=
                    documentHeight - 100;

                if (isAtBottom) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                } else {

                    window.scrollBy({
                        top: windowHeight * 0.85,
                        behavior: "smooth"
                    });

                }

            }
        );

        updateScrollButton();

        window.addEventListener(
            "scroll",
            updateScrollButton
        );

        window.addEventListener(
            "resize",
            updateScrollButton
        );

    }


    /* =========================================
       MESSAGE FLOATING BUTTON
       → GET IN TOUCH PAGE
    ========================================= */

    const messageButton =
        document.querySelector(".message-btn");

    if (messageButton) {

        messageButton.addEventListener(
            "click",
            function (event) {

                /*
                 * If the button has contact.html,
                 * allow normal navigation.
                 */
                const targetPage =
                    this.getAttribute("href");

                if (
                    targetPage &&
                    targetPage !== "#"
                ) {
                    return;
                }

            }
        );

    }


    /* =========================================
       CONTACT FORM
       → WEB3FORMS
    ========================================= */

    const contactForm =
        document.getElementById("contactForm");

    const sendMessageBtn =
        document.getElementById("sendMessageBtn");

    const formStatus =
        document.getElementById("formStatus");

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                console.log("Form submitted");

                if (sendMessageBtn) {

                    sendMessageBtn.disabled = true;

                    const buttonText =
                        sendMessageBtn.querySelector("span");

                    if (buttonText) {
                        buttonText.textContent =
                            "Sending...";
                    }

                }


                if (formStatus) {

                    formStatus.textContent =
                        "Sending message...";

                    formStatus.className =
                        "form-status";

                }


                const formData =
                    new FormData(contactForm);


                try {

                    const response =
                        await fetch(
                            "https://api.web3forms.com/submit",
                            {
                                method: "POST",
                                body: formData
                            }
                        );


                    const result =
                        await response.json();

                    console.log(
                        "Web3Forms response:",
                        result
                    );


                    if (result.success) {

                        if (formStatus) {

                            formStatus.textContent =
                                "Message sent successfully!";

                            formStatus.className =
                                "form-status success";

                        }


                        contactForm.reset();


                        if (sendMessageBtn) {

                            const buttonText =
                                sendMessageBtn.querySelector("span");

                            if (buttonText) {

                                buttonText.textContent =
                                    "Message Sent";

                            }

                        }

                    } else {

                        throw new Error(
                            result.message ||
                            "Message could not be sent."
                        );

                    }


                } catch (error) {

                    console.error(
                        "Web3Forms Error:",
                        error
                    );


                    if (formStatus) {

                        formStatus.textContent =
                            error.message ||
                            "Message could not be sent. Please try again.";

                        formStatus.className =
                            "form-status error";

                    }


                    if (sendMessageBtn) {

                        const buttonText =
                            sendMessageBtn.querySelector("span");

                        if (buttonText) {

                            buttonText.textContent =
                                "Send Message";

                        }

                    }

                } finally {

                    setTimeout(() => {

                        if (sendMessageBtn) {

                            sendMessageBtn.disabled = false;

                            const buttonText =
                                sendMessageBtn.querySelector("span");

                            if (buttonText) {

                                buttonText.textContent =
                                    "Send Message";

                            }

                        }

                    }, 3000);

                }

            }
        );

    }


    /* =========================================
       COMING SOON TOAST
    ========================================= */

    const toastElement =
        document.getElementById("portfolioToast");

    const toastMessage =
        document.getElementById("toastMessage");

    document.querySelectorAll(".coming-soon")
        .forEach(item => {

            item.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    if (!toastElement) {
                        return;
                    }


                    if (toastMessage) {

                        toastMessage.textContent =
                            this.textContent.trim();

                    }


                    if (
                        typeof bootstrap !== "undefined"
                    ) {

                        const toast =
                            bootstrap.Toast.getOrCreateInstance(
                                toastElement
                            );

                        toast.show();

                    }

                }
            );

        });

});
