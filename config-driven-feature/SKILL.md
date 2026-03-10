---
name: config-driven-feature
description: Design or implement a feature using configuration as the primary source of business behavior, while keeping the config readable, explicit, and easy to validate.
argument-hint: "[feature or config area]"
---

# Config-Driven Feature

Use this skill when:
- deciding what belongs in config versus code
- designing or refining YAML-driven behavior
- implementing a feature that should be controlled by configuration
- validating that config remains readable and stable

## Goals
- keep business-facing behavior in configuration where practical
- keep config explicit, human-readable, and reviewable
- avoid hardcoding rules that clearly belong in config
- avoid creating overly dynamic or confusing config structures

## Workflow
1. Read the relevant business/task context first.
2. Identify which parts of the feature should be configurable.
3. Propose a minimal config structure with explicit field names.
4. Identify which behavior should remain in code.
5. Validate that the config is understandable by both developers and analysts.
6. Implement or refine the feature in small, reviewable steps.
7. Highlight assumptions, defaults, and validation rules.

## Default output
Return:
1. proposed config structure
2. explanation of what is config-driven and why
3. code areas that should read or validate the config
4. edge cases and validation considerations
5. anything intentionally kept out of config

## Non-goals
- creating a generic config engine without a clear need
- introducing excessive nesting or abstraction
- burying critical business meaning in opaque config keys
