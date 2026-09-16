#!/usr/bin/env bash
# Install /vibe-character-art globally for Cursor (~/.cursor/skills/).
# Works without GitHub — only needs local files from this repo checkout.
#
# Usage:
#   ./install-global-skill.sh          # install or update
#   ./install-global-skill.sh --uninstall
#
# Requires: bash, cp, mkdir (Git Bash / WSL / macOS / Linux)

set -euo pipefail

SKILL_NAME="vibe-character-art"
DEST="${HOME}/.cursor/skills/${SKILL_NAME}"

# Repo roots (script lives in vh48/.cursor/skills/vibe-character-art/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
ART_ROOT="${REPO_ROOT}/mockups/vibe-hunt/art"
SOURCE_SKILL="${SCRIPT_DIR}/SKILL.md"

REF_A="6f144722-e0bc-429b-b58e-eab882d735cf.jpg"
REF_B="f03e5cfe-462c-4a17-bbce-d15ddd5583bf.jpg"
REF_C="a9fb5a64-ba60-4b27-8504-8c7b6ecd23af.jpg"

usage() {
  cat <<EOF
Install VibeHunt /vibe-character-art skill for all Cursor workspaces.

  $(basename "$0")              Install or update global skill + assets
  $(basename "$0") --uninstall  Remove ${DEST}

After install: reload Cursor (Developer: Reload Window), then type /vibe-character-art

Global install location:
  ${DEST}/
EOF
}

uninstall() {
  if [[ -d "${DEST}" ]]; then
    rm -rf "${DEST}"
    echo "Removed ${DEST}"
  else
    echo "Nothing to remove (${DEST} does not exist)."
  fi
}

install() {
  if [[ ! -f "${SOURCE_SKILL}" ]]; then
    echo "error: SKILL.md not found at ${SOURCE_SKILL}" >&2
    exit 1
  fi
  if [[ ! -d "${ART_ROOT}/references" ]]; then
    echo "error: art bundle not found at ${ART_ROOT}" >&2
    exit 1
  fi

  mkdir -p "${DEST}/references" "${DEST}/examples" "${DEST}/prompt-templates" "${DEST}/generated" "${DEST}/data"

  # Skill + installer (re-run from global copy)
  cp "${SOURCE_SKILL}" "${DEST}/SKILL.md"
  cp "${SCRIPT_DIR}/install-global-skill.sh" "${DEST}/install-global-skill.sh"
  chmod +x "${DEST}/install-global-skill.sh"

  # Style references (required for GenerateImage)
  cp "${ART_ROOT}/references/${REF_A}" "${DEST}/references/"
  cp "${ART_ROOT}/references/${REF_B}" "${DEST}/references/"
  cp "${ART_ROOT}/references/${REF_C}" "${DEST}/references/"

  # Example + prompt template
  if [[ -f "${ART_ROOT}/examples/captain-archetype.png" ]]; then
    cp "${ART_ROOT}/examples/captain-archetype.png" "${DEST}/examples/"
  fi
  if [[ -f "${ART_ROOT}/prompt-templates/card.md" ]]; then
    cp "${ART_ROOT}/prompt-templates/card.md" "${DEST}/prompt-templates/"
  fi

  # VHUI copy texts (optional — sibling backend checkout)
  VHUI_COPIED=false
  for candidate in \
    "${REPO_ROOT}/../vibehunt-backend/methodology/v1.0.0/vhui/vhui_tabl.json" \
    "${REPO_ROOT}/../../vibehunt-backend/methodology/v1.0.0/vhui/vhui_tabl.json" \
    "${REPO_ROOT}/vibehunt-backend/methodology/v1.0.0/vhui/vhui_tabl.json"
  do
    if [[ -f "${candidate}" ]]; then
      cp "${candidate}" "${DEST}/data/vhui_tabl.json"
      VHUI_COPIED=true
      echo "Copied VHUI table from ${candidate}"
      break
    fi
  done

  # Patch SKILL.md for global paths (installed copy only)
  sed -i.bak \
    -e "s|{GENERATED_ROOT}|${DEST}/generated|g" \
    -e "s|{SKILL_ROOT}|${DEST}|g" \
    -e "s|Load copy from \`{SKILL_ROOT}/data/vhui_tabl.json\`|Load copy from \`${DEST}/data/vhui_tabl.json\`|g" \
    -e "s|Save to \`{GENERATED_ROOT}/{filename}\`|Save to \`${DEST}/generated/{filename}\`|g" \
    -e "s|Update \`{GENERATED_ROOT}/manifest.md\`|Update \`${DEST}/generated/manifest.md\`|g" \
    -e "s|mockups/vibe-hunt/art/references/|${DEST}/references/|g" \
    -e "s|mockups/vibe-hunt/art/examples/captain-archetype.png|${DEST}/examples/captain-archetype.png|g" \
    -e "s|mockups/vibe-hunt/art/prompt-templates/card.md|${DEST}/prompt-templates/card.md|g" \
    -e "s|\*\*VHUI (32):\*\* \`vibehunt-backend/methodology/v1.0.0/vhui/vhui_tabl.json\`|**VHUI (32):** \`${DEST}/data/vhui_tabl.json\`|g" \
    "${DEST}/SKILL.md"
  rm -f "${DEST}/SKILL.md.bak"

  # Manifest for generated art
  if [[ ! -f "${DEST}/generated/manifest.md" ]]; then
    cat > "${DEST}/generated/manifest.md" <<EOF
# Generated vibe art — global manifest

Skill root: \`${DEST}\`

| id | filename | variant | status | notes |
|---|---|---|---|---|
EOF
  fi

  # Install record
  cat > "${DEST}/INSTALL.txt" <<EOF
installed_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
source_repo=${REPO_ROOT}
vhui_table=${VHUI_COPIED}
skill_root=${DEST}
EOF

  echo ""
  echo "Installed /vibe-character-art → ${DEST}"
  echo ""
  echo "  references/  — 3 style JPGs"
  echo "  examples/    — captain-archetype.png"
  echo "  data/        — vhui_tabl.json ($([[ "${VHUI_COPIED}" == true ]] && echo "yes" || echo "missing — copy manually or clone vibehunt-backend"))"
  echo "  generated/   — output folder for new images"
  echo ""
  echo "Next: reload Cursor, then type /vibe-character-art in Agent chat."
}

case "${1:-}" in
  -h|--help) usage ;;
  --uninstall) uninstall ;;
  "") install ;;
  *) echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
esac
