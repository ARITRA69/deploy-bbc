import path from "path";

export type ParsedNameAndPath = {
  projectName: string;
  projectDir: string;
}

/**
 * Parses the app name input to extract project name and directory path.
 * Handles:
 * - Current directory: "." (sets up in current directory)
 * - Relative paths: "./my-app", "../my-app"
 * - Home paths: "~/my-app"
 * - Absolute paths: "/path/to/my-app"
 * - Simple names: "my-app" (creates subdirectory in current directory)
 *
 * @param appName - The app name or path provided by the user
 * @returns Object containing projectName (kebab-case) and projectDir (absolute path)
 * @throws Error if the name contains invalid characters (spaces, special chars except - and _)
 */
export function parse_name_and_path(appName: string): ParsedNameAndPath {
  // Handle special case: current directory
  if (appName === ".") {
    const currentDir = process.cwd();
    const currentDirName = path.basename(currentDir);

    return {
      projectName: currentDirName.replace(/_/g, "-").toLowerCase(),
      projectDir: currentDir,
    };
  }

  // Validate app name - no spaces or invalid characters
  // Allow only alphanumeric, hyphens, underscores, slashes, and dots (for paths)
  const pathRegex = /^[a-zA-Z0-9\-_/.]+$/;
  if (!pathRegex.test(appName)) {
    throw new Error(
      `Invalid app name: "${appName}". Use only letters, numbers, hyphens, and underscores.`
    );
  }

  let projectDir: string;
  let projectName: string;

  // Check if it's a path (contains / or starts with . or ~)
  if (appName.includes("/") || appName.startsWith(".") || appName.startsWith("~")) {
    // It's a path - resolve it to absolute
    projectDir = path.resolve(process.cwd(), appName);
    // Extract the last segment as the project name
    projectName = path.basename(projectDir);
  } else {
    // It's just a name - create in current directory
    projectName = appName;
    projectDir = path.resolve(process.cwd(), appName);
  }

  // Ensure project name is kebab-case (convert underscores to hyphens)
  projectName = projectName.replace(/_/g, "-").toLowerCase();

  // Additional validation - ensure name doesn't start/end with hyphen
  if (projectName.startsWith("-") || projectName.endsWith("-")) {
    throw new Error(
      `Invalid app name: "${projectName}". Name cannot start or end with a hyphen.`
    );
  }

  return {
    projectName,
    projectDir,
  };
}
