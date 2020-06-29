import React from "react";
import useViewarApi from "hooks/useViewarApi";
import translationsContext from "./translations-context";

const MOBILEPHONE_SUFFIX = "_Phone";
const WEBVERSION_SUFFIX = "_Web";

/**
 * Translation Service class.
 * Dynamically reads available translation files from assets/translations.
 * The list of translations can be restricted with a uiConfig key translations,
 * e.g. { "translations": ["en"] } for english translations only.
 *
 * We can also use suffixes in the translation keys for special translations on
 * mobile phones ("_Phone") or in the web version ("_Web").
 */
class TranslationService {
  private language: string = "";
  private languages: string[] = [];
  private translations: object = {};
  private isMobilePhoneDevice: boolean = false;
  private isWebVersion: boolean = false;

  constructor() {
    const viewarApi = useViewarApi();

    this.languages = translationsContext
      .keys()
      .map(key => key.replace(/\.\/(.+)(.json$)/, "$1"));

    if (!this.languages.length) {
      throw new Error(`No translation files found! Please create at least one <langkey>.json file assets/translations.`);
    }

    if (
      viewarApi.coreInterface.platform === "Emscripten" &&
      !viewarApi.trackers.EighthWall
    ) {
      this.isWebVersion = true;
    }

    if (viewarApi.appConfig.deviceType === "phone") {
      this.isMobilePhoneDevice = true;
    }

    // Filter out languages from uiConfig.languages (if given)
    const languageFilter = ((viewarApi.appConfig.uiConfig || {}) as any).languages;
    if (languageFilter) {
      this.languages = this.languages.filter(lang => languageFilter.indexOf(lang) !== -1);
    }

    // Load translations from their json files.
    this.translations = {};
    this.languages.forEach(language => {
      const translations = translationsContext(`./${language}.json`); // This is equal to `require(path)`
      this.translations[language] = translations;
    });

    // Use language from appConfig if existing, otherwise use first language.
    if (this.languages.indexOf(viewarApi.appConfig.deviceLanguage) !== -1) {
      this.setLanguage(viewarApi.appConfig.deviceLanguage);
    } else {
      this.setLanguage(this.languages[0]);
    }
  }

  /**
   * Returns either a html element (span, default behavior) or a plain string.
   * First tries to get translation with mobile phone suffix, then with web
   * version suffix or otherwise (if none existing) the default translation.
   */
  translate(id: string, asHtml: boolean = true): string | JSX.Element {
    let translation = "";

    if (this.isMobilePhoneDevice) {
      translation = this.getTranslation(id, MOBILEPHONE_SUFFIX, translation);
    }

    if (!translation && this.isWebVersion) {
      translation = this.getTranslation(id, WEBVERSION_SUFFIX, translation);
    }

    if (!translation) {
      translation = this.getTranslation(id)
    };

    if (this.strNotNull(translation)) {
      return asHtml ? (
        <span dangerouslySetInnerHTML={{ __html: translation }} />
      ) : (
        translation
      );
    } else {
      // No translation found. Return original id.
      return asHtml ? <span dangerouslySetInnerHTML={{ __html: id }} /> : id;
    }
  }

  setLanguage(newLanguage: string): void {
    this.language = newLanguage;
  }

  getLanguage(): string {
    return this.language;
  }

  getLanguages(): string[] {
    return this.languages;
  }

  private getTranslation(id, suffix = "", defaultValue = null) {
    if (this.strNotNull(this.translations[this.language][id + suffix])) {
      return this.translations[this.language][id + suffix];
    } else {
      const fallback = this.getFallbackTranslation(id + suffix);
      return this.strNotNull(fallback) ? fallback : defaultValue;
    }
  }

  private getFallbackTranslation(id) {
    return Object.values(this.translations)[0][id];
  }

  private strNotNull(str) {
    return str || str === "";
  }

}

export default TranslationService;
