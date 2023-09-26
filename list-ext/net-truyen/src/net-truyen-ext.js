export default class extends Extension {
  async home() {
    return [
      {
        title: "Mới cập nhật",
        url: "/tim-truyen",
      },
      {
        title: "Truyện mới",
        url: "/tim-truyen?status=-1&sort=15",
      },
      {
        title: "Top all",
        url: "/tim-truyen?status=-1&sort=10",
      },
    ];
  }

  async itemHome(url, page) {
    const res = await this.request(url, { queryParameters: { page: page } });

    const list = await this.querySelectorAll(res, "div.items div.item");
    const result = [];
    for (const item of list) {
      const html = item.content;
      result.push({
        name: await this.querySelector(html, "h3 a").text,
        link: await this.getAttributeText(html, "h3 a", "href"),
        cover: await this.getAttributeText(html, "img", "src"),
      });
    }
    return result;
  }

  async detail(url) {
    const res = await this.request(url);

    const detailEl = await this.querySelector(res, "article.item-detail");
    const name = await this.querySelector(detailEl.content, "h1.title-detail")
      .text;

    var cover = await this.getAttributeText(detailEl.content, "img", "src");
    if (cover.startsWith("//")) {
      cover = "https:" + cover;
    }
    const authorRow = await this.querySelectorAll(
      detailEl.content,
      "li.author p"
    );
    const author = await this.querySelector(authorRow[1].content, "p").text;

    const description = await this.querySelector(
      detailEl.content,
      "div.detail-content p"
    ).text;

    return {
      name,
      cover,
      author,
      description,
      chapters: await this.chapters(res),
    };
  }

  async chapters(html) {
    const listEl = await this.querySelectorAll(html, "div.list-chapter ul a");
    const chapters = [];

    for (const element of listEl) {
      const url = await this.getAttributeText(element.content, "a", "href");
      const nameChapter = await this.querySelector(element.content, "a").text;
      chapters.push({
        url,
        nameChapter,
      });
    }
    return chapters;
  }

  async chapter(url) {
    const res = await this.request(url);
    const listEl = await this.querySelectorAll(res, "div.page-chapter img");
    let result = [];
    for (const element of listEl) {
      var img = await this.getAttributeText(element.content, "img", "src");
      var other = await this.getAttributeText(
        element.content,
        "img",
        "data-original"
      );
      if (img && img.startsWith("//")) {
        img = "https:" + img;
      }
      if (other && other.startsWith("//")) {
        other = "https:" + other;
      }
      result.push({ img, other });
    }

    return result;
  }

  async search(url, kw, page, filter) {
    const res = await this.request(url, {
      queryParameters: { page: page, keyword: kw },
    });

    const list = await this.querySelectorAll(res, "div.items div.item");
    const result = [];
    for (const item of list) {
      const html = item.content;
      result.push({
        name: await this.querySelector(html, "h3 a").text,
        link: await this.getAttributeText(html, "h3 a", "href"),
        cover: await this.getAttributeText(html, "img", "src"),
      });
    }
    return result;
  }
}
