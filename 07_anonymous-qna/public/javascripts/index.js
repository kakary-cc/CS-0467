// helper function for creating elements (usage optional)
function createElement(type, attrs, ...children) {
    const ele = document.createElement(type);

    // add element attributes
    for (const prop in attrs) {
        if (attrs.hasOwnProperty(prop)) {
            ele.setAttribute(prop, attrs[prop]);
        }
    }

    // add child nodes to element
    children.forEach((c) =>
        ele.appendChild(typeof c === "string" ? document.createTextNode(c) : c)
    );

    return ele;
}

function addTopic(topic) {
    const topicElement = createElement("div", { id: topic._id });
    topicElement.appendChild(createElement("h2", {}, topic.question));
    topicElement.appendChild(
        createElement(
            "ul",
            {},
            ...topic.answers.map((ans) => createElement("li", {}, ans))
        )
    );
    topicElement.appendChild(
        createElement(
            "button",
            { class: "btn-show-modal-answer" },
            "Add an Answer"
        )
    );
    topicElement.appendChild(createElement("hr", {}));
    document.getElementsByTagName("main")[0].appendChild(topicElement);
}

// TODO: finish client side javascript
async function main() {
    const response = await fetch("/questions/");
    if (response.status !== 200) {
        alert("Failed to retrieve questions: " + response.status);
        return;
    }
    const topics = await response.json();
    for (const topic of topics) {
        addTopic(topic);
    }

    const askQuestionBtn = document.getElementById("btn-show-modal-question");
    const dialog = document.getElementById("modal-question");
    askQuestionBtn.addEventListener("click", () => {
        dialog.showModal();
    });

    const cancelBtn = document.getElementsByClassName("close")[0];
    cancelBtn.addEventListener("click", () => {
        dialog.close();
    });

    const askBtn = document.getElementById("create-question");
    askBtn.addEventListener("click", async () => {
        const questionText = document.getElementById("question-text");
        if (questionText.value === "") {
            dialog.close();
        }
        const response = await fetch("/questions/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: questionText.value }),
        });
        const newTopic = await response.json();
        if (newTopic.error) {
            alert("Failed to add question: " + newTopic.error);
            return;
        }
        addTopic(newTopic);
        questionText.value = "";
        dialog.close();
    });
}

main();
