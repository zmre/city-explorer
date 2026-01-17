{
  description = "City Desirability Explorer";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};

      # Build the static site
      city-explorer = pkgs.buildNpmPackage {
        pname = "city-explorer";
        version = "0.1.0";
        src = self + "/web";

        npmDepsHash = "sha256-pBSeMiAfmWmj4bfagu1Ns9kArg0pkTNpgTtg80FG73c=";

        # SvelteKit needs HOME for .svelte-kit directory
        buildPhase = ''
          runHook preBuild
          export HOME=$TMPDIR
          npm run build
          runHook postBuild
        '';

        installPhase = ''
          runHook preInstall
          mkdir -p $out
          cp -r build/* $out/
          runHook postInstall
        '';

        # Don't run prepare script during npm ci
        npmFlags = ["--ignore-scripts"];
        makeCacheWritable = true;

        # Run svelte-kit sync after npm ci
        postConfigure = ''
          npm run prepare
        '';
      };

      # Bundle the web source for use by the dev script
      web-source = pkgs.stdenv.mkDerivation {
        pname = "city-explorer-source";
        version = "0.1.0";
        src = self;
        dontBuild = true;
        installPhase = ''
          mkdir -p $out
          cp -r web/* $out/
        '';
      };

      # Script to run the dev server - works both locally and remotely
      run-dev = pkgs.writeShellApplication {
        name = "city-explorer-dev";
        runtimeInputs = [pkgs.bun];
        text = ''
          # Source is bundled at this Nix store path
          SOURCE_DIR="${web-source}"

          # Create writable temp directory (bun needs to write node_modules)
          WORK_DIR=$(mktemp -d)
          trap 'rm -rf "$WORK_DIR"' EXIT

          echo "Setting up city-explorer dev environment..."
          cp -r "$SOURCE_DIR"/* "$WORK_DIR/"
          cd "$WORK_DIR"

          bun install --frozen-lockfile
          echo "Starting dev server..."
          bun run dev
        '';
      };
    in rec {
      packages = {
        default = city-explorer;
        static = city-explorer;
        dev = run-dev;
      };

      apps = {
        default = {
          type = "app";
          program = "${run-dev}/bin/city-explorer-dev";
        };
      };

      devShell = pkgs.mkShell {
        buildInputs = with pkgs.nodePackages; [
          pkgs.nodejs_22
          pkgs.autoconf
          pkgs.mozjpeg
          pkgs.libtool
          pkgs.automake
          pkgs.nasm
          pkgs.libpng
          pkgs.optipng
          pkgs.pkg-config
          pkgs.gcc
          pkgs.dpkg
          pkgs.playwright-test
          pkgs.playwright-driver
          pkgs.fabric-ai
          pkgs.imagemagick
          pkgs.bun
          (pkgs.yarn-berry.override {nodejs = pkgs.nodejs_22;})
          typescript
          typescript-language-server
          diagnostic-languageserver
          eslint_d
        ];
      };
    });
}
