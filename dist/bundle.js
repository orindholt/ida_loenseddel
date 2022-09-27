'use strict';

// TODO
// - Infobox mobile in view bug (cant scroll to last element)
// - Mobile page pagination arrows covered infobox
// - Rewrite mobile scroll

document.addEventListener("DOMContentLoaded", () => {
	const wrapper = document.querySelector("[data-id='table-wrapper']");
	const langButtonElements = document.querySelectorAll(
		"[data-id='lang-button']"
	);

	let activeTable = wrapper.querySelector("[data-id='paycheck'].active");
	let infoElements = activeTable.querySelectorAll("[data-id='info']");

	const typeSelectElement = document.querySelector("[data-id='select-type']");
	const infoBoxElement = wrapper.querySelector("[data-id='info-box']");
	const infoTextElement = infoBoxElement.querySelector("[data-id='info-text']");
	const infoHeaderElement = infoBoxElement.querySelector(
		"[data-id='info-header']"
	);
	const infoHeaderAltElement = infoBoxElement.querySelector(
		"[data-id='info-header-alt']"
	);
	const infoArrow = infoBoxElement.querySelector("[data-id='info-arrow']");
	const paginationElement = document.querySelector("[data-id='pagination']");
	const pageNumberElement = document.querySelector("[data-id='page-number']");

	let currentLang = langButtonElements[0].getAttribute("data-lang");
	let currentType = typeSelectElement.value.toLowerCase();

	let pageIndex = 0;

	// Updates the active tables
	function updateInfoElements() {
		activeTable = wrapper.querySelector("[data-id='paycheck'].active");
		infoElements = activeTable.querySelectorAll("[data-id='info']");
	}
	// Type select
	typeSelectElement.addEventListener("input", e => {
		let target = e.target;
		currentType = target.value.toLowerCase();
		changeTable(currentType);
	});

	// Sets pagination page numbers
	function setPageNumbers() {
		const currentElement = pageNumberElement.querySelector(
			"[data-id='page-current']"
		);
		const maxElement = pageNumberElement.querySelector("[data-id='page-max']");
		const activeTableType = activeTable.getAttribute("data-type");
		const selectedTables = wrapper.querySelectorAll(
			`[data-type='${activeTableType}']`
		);
		maxElement.textContent = selectedTables.length;
		currentElement.textContent = activeTable.getAttribute("data-page");
	}

	const paginationButtons = wrapper.querySelectorAll(
		"[data-id='pagination-button']"
	);

	function clearPagination() {
		paginationButtons.forEach(el => {
			el.classList.remove("inactive");
		});
	}

	function togglePaginationElements(isNewTable, hasPagination) {
		if (!hasPagination) {
			pageNumberElement.style.display = "none";
			paginationElement.style.display = "none";
			return;
		}
		if (isNewTable) {
			// Resets the pagination buttons to default
			clearPagination();
			paginationButtons[0].classList.add("inactive");
			paginationElement.style.display = "flex";
			pageNumberElement.style.display = "block";
		}
		setPageNumbers();
	}

	// Changes the current paycheck table
	function changeTable(type, page = 0) {
		const selectedTables = wrapper.querySelectorAll(`[data-type='${type}']`);
		if (selectedTables) {
			const prevTableType = activeTable.getAttribute("data-type");

			updateInfoElements();
			activeTable.classList.remove("active");
			selectedTables[page].classList.add("active");
			updateInfoElements();

			const activeTableType = activeTable.getAttribute("data-type");
			const isNewTable = prevTableType !== activeTableType;
			const hasPagination =
				activeTable.getAttribute("data-pagination") === "true";
			if (isNewTable) {
				pageIndex = 0;
			} else if (deviceType() === "desktop") scrollToTarget(infoElements[0]);
			togglePaginationElements(isNewTable, hasPagination);
			closeInfoBox();
			toggleAdditionalInfo();
			/* moveInfoBox(infoElements[0]); */
		}
	}

	// Detects device type
	const deviceType = () => {
		const ua = navigator.userAgent;
		if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
			return "tablet";
		} else if (
			/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
				ua
			)
		) {
			return "mobile";
		}
		return "desktop";
	};

	if (deviceType() === "desktop") {
		// Scroll logic

		// Scrolls to target
		function scrollToTarget(target) {
			const rect = target.getBoundingClientRect();
			const scrollAmount = rect.top + window.scrollY - window.innerHeight / 3;
			$("html, body").stop().animate({
				scrollTop: scrollAmount,
			});
		}

		// Date for throttling
		let prevTime = Date.now();

		// Scroll event
		function scrollEvent(e) {
			const throttleAmount = 300;
			if (Date.now() > prevTime + throttleAmount) {
				prevTime = Date.now();
				updateInfoElements();
				const activeEl = activeTable.querySelector(".active");
				const nextIndex = Array.from(infoElements).indexOf(activeEl) + 1;
				const prevIndex = Array.from(infoElements).indexOf(activeEl) + -1;
				const nextEl = infoElements[nextIndex];
				const prevEl = infoElements[prevIndex];

				if (activeEl) {
					if (e.deltaY > 0) {
						if (nextEl) {
							moveInfoBox(nextEl);
							scrollToTarget(nextEl);
						}
					} else if (e.deltaY < 0) {
						if (prevEl) {
							moveInfoBox(prevEl);
							scrollToTarget(prevEl);
						}
					}
				} else {
					openInfoBox();
					moveInfoBox(infoElements[0]);
				}
			}

			e.preventDefault();
			e.stopPropagation();
			return false;
		}

		// Hover logic
		const isHover = target =>
			target.parentElement.querySelector(":hover") === target;

		document.addEventListener("mousemove", function () {
			const hovered = isHover(wrapper);
			if (hovered !== this.hovered) {
				this.hovered = hovered;
				if (!hovered) {
					// Removes eventlistener when table is unhovered
					wrapper.removeEventListener("wheel", scrollEvent);
				} else {
					// Adds eventlistener when table is hovered
					wrapper.addEventListener("wheel", scrollEvent, false);
				}
			}
		});
	}

	// Clears the active class off all the info fields
	function clearActive() {
		infoElements.forEach(el => {
			el.classList.remove("active");
			if (!el.classList.length) el.removeAttribute("class");
		});
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
		clearActive();
		infoBoxElement.style.display = "none";
		if (infoBoxElement.style.opacity === "1")
			infoBoxElement.style.opacity = "0";
	}

	function infoBoxFadeOut() {
		if (infoBoxElement.style.display === "block") {
			if (infoBoxElement.style.opacity === "1")
				infoBoxElement.style.opacity = "0";
			setTimeout(() => {
				closeInfoBox();
			}, 500);
		}
	}

	function changeInfoText(target) {
		if (
			target.getAttribute("data-info-dk") &&
			target.getAttribute("data-info-en")
		) {
			infoTextElement.style.removeProperty("display");
			const infoText =
				currentLang === "dk"
					? target.getAttribute("data-info-dk")
					: target.getAttribute("data-info-en");
			infoTextElement.innerHTML = infoText;
		} else infoTextElement.style.display = "none";
		if (
			target.getAttribute("data-header-dk") &&
			target.getAttribute("data-header-en")
		) {
			infoHeaderElement.style.removeProperty("display");
			const infoHeader =
				currentLang === "dk"
					? target.getAttribute("data-header-dk")
					: target.getAttribute("data-header-en");
			infoHeaderElement.textContent = infoHeader;
		} else infoHeaderElement.style.display = "none";
		if (
			target.getAttribute("data-header-dk") &&
			target.getAttribute("data-header-en")
		) {
			infoHeaderAltElement.style.removeProperty("display");
			const infoHeaderAlt =
				currentLang === "dk"
					? target.getAttribute("data-header-en")
					: target.getAttribute("data-header-dk");
			infoHeaderAltElement.textContent = infoHeaderAlt;
		} else infoHeaderAltElement.style.display = "none";
	}

	const infoBoxMaxWidth = parseInt(
		getComputedStyle(infoBoxElement).maxWidth.replace("px", "")
	);
	const infoboxStyleRight = getComputedStyle(infoBoxElement).right;
	// Moves the info box
	function moveInfoBox(target) {
		changeInfoText(target);
		if (deviceType() === "mobile") {
			const targetLeft = target.offsetLeft;
			const targetWidth = target.clientWidth;
			if (targetLeft) {
				infoArrow.style.left = `${targetLeft + targetWidth / 2}px`;
			} else {
				infoArrow.style.removeProperty("left");
				if (!infoArrow.style.length) infoArrow.removeAttribute("style");
			}
		} else if (deviceType() === "desktop" && window.innerWidth > 1280) {
			const targetRight =
				activeTable.offsetWidth - (target.offsetLeft + target.offsetWidth);
			if (targetRight > 0) {
				infoBoxElement.style.right = `calc(${infoboxStyleRight} + ${targetRight}px)`;
			} else if (infoBoxElement.style.right)
				infoBoxElement.style.removeProperty("right");
		}

		const targetHeight = target.clientHeight;
		const isOverflowing = target.getAttribute("data-info-dk").length > 650;

		if (isOverflowing) {
			infoBoxElement.style.maxWidth = `${infoBoxMaxWidth * 2}px`;
		} else if (infoBoxElement.style.maxWidth)
			infoBoxElement.style.removeProperty("max-width");

		// Moves the actual infobox
		const elementPosY = Math.floor(
			target.offsetTop + targetHeight / (targetHeight > 50 ? 2 : 1) + 20
		);
		infoBoxElement.style.top = `${elementPosY}px`;

		clearActive();
		target.classList.add("active");
		openInfoBox();
	}

	// Close info box click
	document
		.querySelector("[data-id='info-close']")
		.addEventListener("click", infoBoxFadeOut);

	// Click event on info fields
	wrapper.querySelectorAll("[data-id='info']").forEach(el =>
		el.addEventListener("click", e => {
			let target = e.currentTarget;
			openInfoBox();
			moveInfoBox(target);
			if (deviceType() === "desktop") {
				scrollToTarget(target);
			}
		})
	);

	// Language click event
	langButtonElements.forEach(el => {
		el.addEventListener("click", e => {
			updateInfoElements();
			const activeEl = activeTable.querySelector(".active");
			let target = e.currentTarget;
			currentLang = target.getAttribute("data-lang");
			changeInfoText(activeEl);
		});
	});

	function updatePaginationButtons(max) {
		const currentPage = pageIndex + 1;
		const prevButton = paginationElement.querySelector(
			"[data-direction='prev']"
		);
		const nextButton = paginationElement.querySelector(
			"[data-direction='next']"
		);
		clearPagination();
		if (currentPage === max) {
			nextButton.classList.add("inactive");
		} else if (currentPage === 1) {
			prevButton.classList.add("inactive");
		}
	}

	// Turns the pages via the pagination buttons
	function turnPage(clickedArrowElement) {
		// Disables the inactive button
		if (clickedArrowElement.classList.contains("inactive")) return;

		const direction = clickedArrowElement.getAttribute("data-direction");
		const activeTableType = activeTable.getAttribute("data-type");
		const selectedTables = wrapper.querySelectorAll(
			`[data-type='${activeTableType}']`
		);
		let maxPagination = selectedTables.length;

		if (direction === "next") {
			pageIndex++;
		} else if (direction === "prev") {
			pageIndex--;
		}

		if (pageIndex === selectedTables.length - 1) {
			clearPagination();
			updatePaginationButtons(maxPagination);
		} else if (pageIndex === 0) {
			clearPagination();
			updatePaginationButtons(maxPagination);
		}

		// Turns the actual page
		changeTable(activeTableType, pageIndex);
	}

	// Pagination click event
	paginationButtons.forEach(el =>
		el.addEventListener("click", e => turnPage(e.currentTarget))
	);

	// Additional Info toggle
	const additionalBoxes = document.querySelectorAll(
		"[data-id='additional-info']"
	);

	function toggleAdditionalInfo() {
		additionalBoxes.forEach(box => {
			if (box.style.display !== "none") box.style.display = "none";
			const conditions = box
				.getAttribute("data-conditions")
				.replace(/\s/g, "")
				.split(",");
			let activeTableType = activeTable.getAttribute("data-type");
			if (conditions.includes(activeTableType)) box.style.display = "block";
		});
	}
}); // DOMContentLoaded Event End
