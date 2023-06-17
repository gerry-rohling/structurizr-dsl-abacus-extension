import * as vscode from 'vscode';
import { WorkspaceFactory } from './WorkspaceFactory';
import { DrawIOFormatter } from './formatters/DrawIOFormatter';
import path = require('path');

export class StructurizrCompiler {
	static async compileToDrawIO(uri: vscode.Uri) {
		// We get passed in the Uri of the file linked to the open document but
		// We can likely get the active document as well and obtain what we need from that
		// I think it may be better to use the open document as that may have edits not saved yet
		// Step 1. Load open document into new workspace
		let sourceDoc = vscode.window.activeTextEditor.document;
		let factory = new WorkspaceFactory();
		let workspace = await factory.parseDSL(sourceDoc.getText());
		// Step 2. Generate required diagrams from workspace
		let drawIOformatter = new DrawIOFormatter();
		let c4 = await drawIOformatter.formatWorkspace(workspace);
		// Step 3. Save these diagrams into new files. We may loop over steps 2 and 3 for each diagram required
		let basePath = path.dirname(sourceDoc.uri.fsPath);
		throw new Error('Method not implemented.');
	}

}