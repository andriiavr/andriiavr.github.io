import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Handlebars from "handlebars";

import JSONprojects from "./projects.json";
import axios from "axios";

import projectTemplate from "./templates/project.hbs";
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : arg1;
});
Handlebars.registerHelper('join', function(array) {
  return array.join(" ")
})

const placeholderImage =
  "https://hips.hearstapps.com/hmg-prod/images/ginger-maine-coon-kitten-running-on-lawn-in-royalty-free-image-1719608142.jpg";
const projectsList = document.querySelector(".projects-list");

const lenis = new Lenis({
  autoRaf: true,
});

lenis.on("scroll", (e) => {
  // console.log(e.targetScroll);
});

async function fetchRepos() {
  try {
    const response = await axios.get(
      "https://api.github.com/users/andriiavr/repos",
      {
        params: {
          sort: "pushed",
          direction: "desc",
          per_page: 9,
        },
      },
    );
    console.log(response.data)
    const { data } = response;
    return data;
  } catch (err) {
    return [{ name: "error" }];
  }
}

function renderProjects(projects) {
  projectsList.innerHTML = "";
  projects.forEach((project) => {
    const date = new Date(project.pushed_at,).toLocaleDateString("en-GB",
    { day: "2-digit", month: "numeric", year: "numeric", })
    let markup = projectTemplate({...project, date});
    projectsList.insertAdjacentHTML("beforeend", markup);
  });
  projectsList
    .querySelectorAll(".animate")
    .forEach((el) => observer.observe(el));
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.3 },
);

async function handleTypeChange(e) {
  const btn = e.target.closest("[data-value]");
  let projects;
  switch (btn.dataset.value) {
    case "selected":
      projects = JSONprojects.projects;
      break;
    case "github":
      projects = await fetchRepos();
      break;
    default:
      break;
  }
  renderProjects(projects);
  console.log(projects);
  console.log(btn.dataset.value);
}

async function main() {
  const projects2 = await fetchRepos();
  renderProjects(JSONprojects.projects);

  document
    .querySelector(".project-switch")
    .addEventListener("click", handleTypeChange);
  document.querySelectorAll(".animate").forEach((el) => observer.observe(el));
}

main();
