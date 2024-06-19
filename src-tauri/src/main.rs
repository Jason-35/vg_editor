// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    return format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn save_file(path: String, content: String) {
    fs::write(path, content).expect("Unable to write file");
}

#[tauri::command]
fn open_file(path: String) -> (String, String) {
    if let Ok(content) = fs::read_to_string(&path) {
        return (content, path);
    } else {
        return ("".to_string(), "".to_string());
    }
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
