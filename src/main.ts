import { decreaseHeading, increaseHeading } from "features/shiftHeading";
import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import { composeLineChanges } from "utils/editorChange";
import { getHeadingLines } from "utils/heading";
import { ApplyHeading } from "./features/applyHeading";

interface MyPluginSettings {
	limitHeadingFrom: number;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	limitHeadingFrom: 1,
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		/* Apply Heading Command */
		[0, 1, 2, 3, 4, 5].forEach((heading) =>
			this.addCommand(new ApplyHeading(heading).command)
		);

		/* Shift Heading Command */
		this.addCommand({
			id: "increase-heading",
			name: "Increase Heading",
			editorCallback: (editor, view) => {
				const { headingLines, maxHeading } = getHeadingLines(
					editor,
					editor.getCursor("from").line,
					editor.getCursor("to").line
				);

				if (maxHeading !== undefined && maxHeading >= 5) {
					return new Notice(
						"Cannot Increase (includes over Heading 5)"
					);
				}

				editor.transaction({
					changes: composeLineChanges(
						editor,
						headingLines,
						increaseHeading
					),
				});
			},
		});

		this.addCommand({
			id: "decrease-heading",
			name: "Decrease Heading",
			editorCallback: (editor, view) => {
				const { headingLines, minHeading } = getHeadingLines(
					editor,
					editor.getCursor("from").line,
					editor.getCursor("to").line
				);

				if (
					minHeading !== undefined &&
					minHeading <= Number(this.settings.limitHeadingFrom)
				) {
					return new Notice(
						`Cannot Decrease (includes under Heading${this.settings.limitHeadingFrom})`
					);
				}

				editor.transaction({
					changes: composeLineChanges(
						editor,
						headingLines,
						decreaseHeading
					),
				});
			},
		});

		this.addSettingTab(new SettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Lower limit of Heading")
			.setDesc("")
			.addDropdown((n) => {
				const headingOptions: Record<string, string> = {
					noHeading: "0",
					heading1: "1",
					heading2: "2",
					heading3: "3",
					heading4: "4",
					heading5: "5",
				};
				n.addOptions(headingOptions)
					.setValue(String(this.plugin.settings.limitHeadingFrom))
					.onChange(async (value) => {
						this.plugin.settings.limitHeadingFrom = Number(value);
						await this.plugin.saveSettings();
					});
			});
	}
}