#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::menu::{MenuBuilder, MenuItemBuilder};
use tauri::tray::TrayIconBuilder;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder::default()
		.plugin(tauri_plugin_opener::init())
		.setup(|app| {
			let show = MenuItemBuilder::with_id("show", "Open status…").build(app)?;
			let quit = MenuItemBuilder::with_id("quit", "Quit").build(app)?;
			let menu = MenuBuilder::new(app).items(&[&show, &quit]).build()?;
			let icon = app.default_window_icon().unwrap().clone();
			let _tray = TrayIconBuilder::new()
				.icon(icon)
				.menu(&menu)
				.show_menu_on_left_click(true)
				.on_menu_event(|app, event| {
					match event.id().as_ref() {
						"quit" => {
							app.exit(0);
						}
						"show" => {
							if let Some(w) = app.get_webview_window("main") {
								let _ = w.show();
								let _ = w.set_focus();
							}
						}
						_ => {}
					}
				})
				.build(app)?;
			Ok(())
		})
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
