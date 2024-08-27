// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import path = require("path");
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		"vicperdana.psdocs-vscode-preview",
		() => {
			var currentlyOpenFilePath =
				vscode.window.activeTextEditor?.document.uri.fsPath;

			var templatePath = "";
			var outputPath = "";
			var templateFolderPath = "";
			const options: vscode.InputBoxOptions = {
				prompt: "Full path to the ARM template: ",
				value: `${currentlyOpenFilePath}`,
			};

			vscode.window.showInputBox(options).then((value) => {
				if (!value) return;
				templatePath = value;
				templateFolderPath = path.dirname(templatePath);
				const options: vscode.InputBoxOptions = {
					prompt: "Output Path of the Markdown (relative path from the ARM template file): ",
					value: "out\\docs\\",
				};
				vscode.window.showInputBox(options).then((value) => {
					if (!value) return;
					outputPath = value;

					const { exec } = require("child_process");
					var message = "";
					exec(
						`Import-Module PSDocs.Azure; Invoke-PSDocument -Module PSDocs.Azure -InputObject ${templatePath} -OutputPath ${templateFolderPath}/${outputPath};`,
						{ shell: "pwsh" },
						(error: any, stdout: any, stderr: any) => {
							message = stderr;
							if (message !== "") {
								vscode.window.showErrorMessage(message);
							} else {
								vscode.window.showInformationMessage(
									`Markdown generated in ${templateFolderPath}/${outputPath}`,
								);
							}
						},
					);
				});
			});
		},
	);
}

export function deactivate() {}
