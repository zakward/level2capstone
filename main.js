const form = document.form;

function getData() {
  axios
    .get("https://api.vschool.io/zakward/todo/")
    .then((res) => listData(res.data))
    .catch((err) => console.log(err));
}

function clearListData() {
  const list = document.getElementById("list");
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTodo = {
    title: form.title.value,
    description: form.description.value,
    price: form.price.value,
    imgUrl: form.imgUrl.value,
  };
  form.title.value = "";
  form.description.value = "";
  form.price.value = "";
  form.imgUrl.value = "";

  axios
    .post("https://api.vschool.io/zakward/todo", newTodo)
    .then((res) => getData())
    .catch((err) => console.log(err));
});

function listData(data) {
  clearListData();

  const list = document.getElementById("list");
  for (let i = 0; i < data.length; i++) {
    const iD = data[i]._id;

    const div = document.createElement("div");

    list.appendChild(div);
    const h1 = document.createElement("h1");
    h1.textContent = data[i].title;
    div.appendChild(h1);
    div.className = "todo-item";

    const p = document.createElement("p");
    p.textContent = data[i].description;
    div.appendChild(p);
    p.className = "todo-item-details";

    const p2 = document.createElement("p");
    p2.textContent = data[i].price;
    div.appendChild(p2);
    p2.className = "todo-item-details";

    const img = document.createElement("img");
    img.src = data[i].imgUrl;
    div.appendChild(img);
    img.className = "todo-item-img";

    const buttonDiv = document.createElement("div");
    buttonDiv.className = "button-div";
    div.appendChild(buttonDiv);

    const button = document.createElement("button");
    button.textContent = "Delete";
    buttonDiv.appendChild(button);
    button.className = "todo-item-buttons";

    const button2 = document.createElement("button");
    button2.textContent = "Edit";
    buttonDiv.appendChild(button2);
    button2.className = "todo-item-buttons";

    const label = document.createElement("label");
    label.textContent = "Completed";
    div.appendChild(label);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    div.appendChild(checkbox);

    if (data[i].completed === true) {
      h1.style.textDecoration = "line-through";
      p.style.textDecoration = "line-through";
      p2.style.textDecoration = "line-through";
      h1.style.textDecorationColor = "black";
      p.style.textDecorationColor = "black";
      p2.style.textDecorationColor = "black";
      checkbox.checked = true;
    }

    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        axios
          .put(`https://api.vschool.io/zakward/todo/${iD}`, { completed: true })
          .then((res) => getData())
          .catch((err) => console.log(err));
      } else {
        axios
          .put(`https://api.vschool.io/zakward/todo/${iD}`, {
            completed: false,
          })
          .then((res) => getData())
          .catch((err) => console.log(err));
      }
    });

    button.addEventListener("click", () => {
      axios
        .delete(`https://api.vschool.io/zakward/todo/${iD}`)
        .then((res) => getData())
        .catch((err) => console.log(err));
    });

    button2.addEventListener("click", () => {
      h1.remove(this);
      p.remove(this);
      p2.remove(this);
      img.remove(this);

      const imgEdit = document.createElement("input");
      imgEdit.value = img.src;
      div.prepend(imgEdit);
      imgEdit.setAttribute("class", "editInput");

      const descriptionEdit = document.createElement("input");
      descriptionEdit.value = p.textContent;
      div.prepend(descriptionEdit);
      descriptionEdit.setAttribute("class", "editInput");

      const priceEdit = document.createElement("input");
      priceEdit.value = p2.textContent;
      div.prepend(priceEdit);
      priceEdit.setAttribute("type", "number");

      const titleEdit = document.createElement("input");
      titleEdit.value = h1.textContent;
      div.prepend(titleEdit);
      titleEdit.setAttribute("class", "editInput");

      button2.remove(this);
      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      div.appendChild(saveBtn);

      saveBtn.addEventListener("click", function () {
        const updatedInfo = {
          title: titleEdit.value,
          description: descriptionEdit.value,
          price: priceEdit.value,
          imgUrl: imgEdit.value,
        };

        console.log(updatedInfo);

        axios
          .put(`https://api.vschool.io/zakward/todo/${iD}`, updatedInfo)
          .then((response) => getData())
          .catch((err) => console.log(err));

        priceEdit.remove(this);
        imgEdit.remove(this);
        descriptionEdit.remove(this);
        titleEdit.remove(this);

        saveBtn.remove(this);
        div.appendChild(button2);
      });
    });
  }
}

getData();
