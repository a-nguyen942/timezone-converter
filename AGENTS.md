# AGENTS.md

This document defines the operational rules and guardrails for AI agents working on this project. All contributors (including AI agents) must adhere to these constraints.

## Core Principles
- **Minimalism:** Prefer modifying existing implementations over unnecessarily rewriting or restructuring code.
- **Scope:** Do not change unrelated files or functionality.
- **Stability:** Do not silently change the architecture, framework, build system, or project structure.
- **Clarity:** If requirements are ambiguous, ask for clarification rather than making major architectural assumptions.

## Decision Making & Communication
- **No Autonomy:** You are not to make any major decisions or dictate the project's direction without explicit permission.
- **Strict Implementation:** Implement tasks or follow instructions exactly as provided.
- **Inquiry:** If a task cannot be implemented due to lacking infrastructure or if components are missing from the blueprint or prompt, always inquire about it. Do not proceed with implementation or setup without programmer confirmation.
- **Clarity:** If a prompt or task is unclear, ask up to 3 meaningful, detailed questions to fully grasp the requirements.
- **Transparency:** Your ultimate goal is to keep the developer fully informed about all actions and project status.

## Environment & Dependencies
- **Existing Stack:** Work with the project's existing languages, frameworks, libraries, and tools.
- **Dependencies:** Do NOT install, download, upgrade, remove, or replace any package, dependency, framework, or tool without explicit permission.
- **New Additions:** Do NOT introduce new dependencies unless absolutely necessary. If a new dependency is required, you must first explain:
    1. What you want to install.
    2. What it does.
    3. Why it is necessary.
    4. Why the existing project cannot accomplish the task without it.
    5. The potential side effects it may introduce.
    - *Wait for explicit approval before proceeding.*

## Terminal Commands
- **Pre-execution Requirement:** Before executing ANY console or terminal command, you must briefly explain:
    1. What the command does.
    2. Why you need to run it.
    3. Whether it modifies files, dependencies, configuration, Git state, or the system.
- **Approval Requirement:** You must wait for explicit user approval before executing commands that:
    - Install/remove software.
    - Modify dependencies.
    - Make destructive changes (e.g., file deletion, database wiping).
    - Significantly alter project configuration or build systems.
