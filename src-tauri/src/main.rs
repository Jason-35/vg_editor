// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    return format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn save_file() {

}

#[tauri::command]
fn open_file() {

}

#[tauri::command]
fn save_as_file() {

}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            save_file,
            save_as_file,
            open_file
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
