// show hide password
const container = document.querySelector(".container"),
	togglePwd = document.querySelectorAll(".toggle-pwd"),
	pwdField = document.getElementById("password"),
	confirmPwdField = document.getElementById("confirm-pwd");

if (togglePwd) {
	togglePwd.forEach((eyeIcon) => {
		eyeIcon.addEventListener("click", (e) => {
			if (e.target.classList.contains("confirm-pwd")) {
				if (confirmPwdField.type === "password") {
					confirmPwdField.type = "text";

					eyeIcon.classList.replace("uil-eye-slash", "uil-eye");
				} else {
					confirmPwdField.type = "password";

					eyeIcon.classList.replace("uil-eye", "uil-eye-slash");
				}
			} else {
				if (pwdField.type === "password") {
					pwdField.type = "text";

					eyeIcon.classList.replace("uil-eye-slash", "uil-eye");
				} else {
					pwdField.type = "password";

					eyeIcon.classList.replace("uil-eye", "uil-eye-slash");
				}
			}
		});
	});
}

// validation
const emailRegex =
	/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

if (loginForm) {
	loginForm.addEventListener("submit", (e) => {
		const email = document.querySelector("#email").value;
		const password = document.querySelector("#password").value;

		if (email === "") {
			showError("Please enter your email", ".error-message.email");
			e.preventDefault();
		} else if (!emailRegex.test(email)) {
			showError("Wrong email", ".error-message.email");
			e.preventDefault();
		} else {
			showError("", ".error-message.email");
		}

		if (password === "") {
			showError("Please enter your password", ".error-message.pwd");
			e.preventDefault();
		} else {
			showError("", ".error-message.pwd");
		}
	});
}

if (registerForm) {
	registerForm.addEventListener("submit", (e) => {
		const name = document.querySelector("#name").value;
		const email = document.querySelector("#email").value;
		const password = document.querySelector("#password").value;
		const confirmPwd = document.querySelector("#confirm-pwd").value;

		if (name === "") {
			showError("Please enter your name", ".error-message.name");
			e.preventDefault();
		} else if (name.length < 5) {
			showError("Name must be at least 5 characters", ".error-message.name");
			e.preventDefault();
		} else {
			showError("", ".error-message.name");
		}

		if (email === "") {
			showError("Please enter your email", ".error-message.email");
			e.preventDefault();
		} else if (!emailRegex.test(email)) {
			showError("Wrong email", ".error-message.email");
			e.preventDefault();
		} else {
			showError("", ".error-message.email");
		}

		if (password === "") {
			showError("Please enter your password", ".error-message.pwd");
			e.preventDefault();
		} else if (password.length < 5) {
			showError("Password must be at least 5 characters", ".error-message.pwd");
			e.preventDefault();
		} else {
			showError("", ".error-message.pwd");
		}

		if (confirmPwd === "") {
			showError("Please confirm your password", ".error-message.confirm-pwd");
			e.preventDefault();
		} else if (confirmPwd !== password) {
			showError("Password does not match", ".error-message.confirm-pwd");
			e.preventDefault();
		} else {
			showError("", ".error-message.confirm-pwd");
		}
	});
}

function showError(message, element) {
	const errorBox = document.querySelector(element);

	if (message === "") {
		errorBox.style.display = "none";
	} else {
		errorBox.textContent = message;
		errorBox.style.display = "block";
	}
}

// show hide search bar
const searchBar = document.querySelector(".users .search input"),
	searchBtn = document.querySelector(".users .search button");

if (searchBtn) {
	searchBtn.onclick = () => {
		searchBar.classList.toggle("active");
		searchBar.focus();
		searchBtn.classList.toggle("active");
	};

	searchBar.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			const xhr = new XMLHttpRequest();
			xhr.open("POST", "/search");
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.onreadystatechange = () => {
				if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
					let divUsersList = document.querySelector(".users-list");
					divUsersList.textContent = "";

					const accounts = JSON.parse(xhr.responseText).accounts;

					accounts.forEach((account) => {
						let a = document.createElement("a");
						a.href = "#";
						a.className = "text";

						let divContent = document.createElement("div");
						divContent.className = "content";

						let img = document.createElement("img");
						img.src = "/img/user.png";

						let divDetails = document.createElement("div");
						divDetails.className = "details";

						let span = document.createElement("span");
						span.textContent = account.name;

						let p = document.createElement("p");
						p.textContent = "This is test message";

						divDetails.appendChild(span);
						divDetails.appendChild(p);

						divContent.appendChild(img);
						divContent.appendChild(divDetails);

						let divStatusDot = document.createElement("div");
						divStatusDot.className = "status-dot";

						if (account.status === "Offline") {
							divStatusDot.style.backgroundColor = "#ffcc70";
						}

						a.appendChild(divContent);
						a.appendChild(divStatusDot);

						divUsersList.appendChild(a);
					});
				} else {
					console.log(xhr.responseText);
				}
			};
			xhr.send("searchString=" + e.target.value);
		}
	});
}

const chatBox = document.querySelector(".chat-box");
if (chatBox) {
	chatBox.scrollTop = chatBox.scrollHeight;
}

// show chat
function showChat(message, type) {
	const chatDiv = document.createElement("div");
	chatDiv.className = "chat " + type;

	if (type === "incoming") {
		const img = document.createElement("img");
		img.src = "/img/user.png";
		chatDiv.appendChild(img);
	}

	const detailsDiv = document.createElement("div");
	detailsDiv.className = "details";

	const p = document.createElement("p");
	p.textContent = message;

	detailsDiv.appendChild(p);
	chatDiv.appendChild(detailsDiv);

	// Add a delay before adding the .sent class
	setTimeout(() => {
		chatDiv.classList.add("sent");
	}, 100);

	chatBox.appendChild(chatDiv);
	chatBox.scrollTop = chatBox.scrollHeight;
}

function updateStatus(account) {
	const userElement = document.getElementById(account._id);
	const statusElement = userElement.querySelector(".status-dot");

	if (account.status === "Offline") {
		statusElement.style.backgroundColor = "#ffcc70";
	} else {
		statusElement.style.backgroundColor = "#468869";
	}
}
