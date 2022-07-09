document.addEventListener("DOMContentLoaded", () => {
	const wrapper = document.querySelector("[data-id='table-wrapper']");

	// Scroll logic
	const getPosY = target =>
		target.getBoundingClientRect().bottom + window.scrollY;

	function scrollEvent(e) {
		const activeEl = wrapper.querySelector(".active");
		const nextIndex = Array.from(infoElements).indexOf(activeEl) + 1;
		const prevIndex = Array.from(infoElements).indexOf(activeEl) + -1;
		const nextEl = infoElements[nextIndex];
		const prevEl = infoElements[prevIndex];

		if (e.deltaY > 0) {
			if (nextEl) {
				moveInfoBox(nextEl);
				$("html, body")
					.stop()
					.animate({
						scrollTop: getPosY(nextEl) / 2,
					});
			}
		} else if (e.deltaY < 0) {
			if (prevEl) {
				moveInfoBox(prevEl);
				$("html, body")
					.stop()
					.animate({
						scrollTop: getPosY(prevEl) / 2,
					});
			}
		}
	}

	// Hover logic
	const isHover = e => e.parentElement.querySelector(":hover") === e;
	const handleScroll = e => scrollEvent(e);

	document.addEventListener("mousemove", function checkHover() {
		const hovered = isHover(wrapper);
		if (hovered !== checkHover.hovered) {
			checkHover.hovered = hovered;
			if (!hovered) {
				// Adds eventlistener when table is hovered
				document.removeEventListener("wheel", handleScroll);
			} else {
				// Removes eventlistener when table is unhovered
				document.addEventListener("wheel", handleScroll, false);
			}
		}
	});

	// Infobox logic
	const infoElements = wrapper.querySelectorAll("[data-id='info']");
	const infoBoxElement = wrapper.querySelector("[data-id='info-box']");
	const infoTextElement = infoBoxElement.querySelector("[data-id='info-text']");
	const infoHeaderElement = infoBoxElement.querySelector(
		"[data-id='info-header']"
	);

	// Initial info box position
	infoBoxElement.style.top = `${Math.floor(
		infoElements[0].getBoundingClientRect().bottom + window.scrollY - 190
	)}px`;
	infoTextElement.textContent = infoElements[0].getAttribute("data-info-data");
	infoHeaderElement.textContent =
		infoElements[0].getAttribute("data-info-header");

	infoElements[0].classList.add("active");
	openInfoBox();

	// Clears the active class off all the info fields
	function clearActive() {
		infoElements.forEach(el => el.classList.remove("active"));
	}

	// Opens the info box
	function openInfoBox() {
		if (infoBoxElement.style.display !== "block") {
			infoBoxElement.style.display = "block";
			setTimeout(() => {
				infoBoxElement.style.opacity = "1";
			}, 100);
		}
	}

	// Closes the info box
	function closeInfoBox() {
		if (infoBoxElement.style.display === "block") {
			clearActive();
			infoBoxElement.style.opacity = "0";
			setTimeout(() => {
				infoBoxElement.style.display = "none";
			}, 500);
		}
	}

	// Moves the info box
	function moveInfoBox(target) {
		const infoText = target.getAttribute("data-info-data");
		const infoHeader = target.getAttribute("data-info-header");
		const elementPosY = getPosY(target);

		infoTextElement.textContent = infoText;
		infoHeaderElement.textContent = infoHeader;
		infoBoxElement.style.top = `${Math.floor(elementPosY - 190)}px`;
		clearActive();
		target.classList.add("active");
		openInfoBox();
	}

	// Click Event
	document
		.querySelector("[data-id='info-close']")
		.addEventListener("click", closeInfoBox);

	infoElements.forEach(element =>
		element.addEventListener("click", e => {
			moveInfoBox(e.currentTarget);
			const activeEl = wrapper.querySelector(".active");
			$("html, body").animate({
				scrollTop: getPosY(activeEl) / 2,
			});
		})
	);
});
