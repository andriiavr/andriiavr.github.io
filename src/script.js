import Lenis from "lenis";
import "lenis/dist/lenis.css";

import JSONprojects from "./projects.json";
import axios from "axios";

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
          per_page: 8,
        },
      },
    );
    const { data } = response;
    return data;
  } catch (err) {}
}

function renderProjects(projects) {
  projectsList.innerHTML = "";
  projects.forEach((project) => {
    let markup = `<li class="projects-item animate ">
              ${!project.thumbnail ? `` : `<img src="${project.thumbnail}" alt="Project thumbnail" class="projects-thumbnail">`}
              <p class="projects-name">${project.name}</p>
              <p class="projects-time">${new Date(
                project.pushed_at,
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "numeric",
                year: "numeric",
              })}</p>
              <ul class="projects-links">
                ${!project.homepage ? `` : `<li class="projects-link"><a href="${project.homepage}" target="_blank">Website</a></li>`}
                <li class="projects-link"><a href="${project.html_url}" target="_blank">Source code</a></li>
              </ul>
            </li>`;
    projectsList.insertAdjacentHTML("beforeend", markup);
    projectsList.querySelectorAll(".animate").forEach((el) => observer.observe(el));
  });
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
  let projects
  switch (btn.dataset.value) {
    case "selected":
      projects = JSONprojects.projects;
      break
    case "github":
      projects = await fetchRepos();
      break
    default:
      break
  }
  renderProjects(projects)
  console.log(projects)
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
