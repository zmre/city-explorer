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
      city-explorer = pkgs.stdenv.mkDerivation {
        pname = "city-explorer";
        version = "0.1.0";
        src = self;

        nativeBuildInputs = [pkgs.bun pkgs.nodejs_22];

        buildPhase = ''
          cd web
          export HOME=$TMPDIR
          bun install --frozen-lockfile
          bun run build
        '';

        installPhase = ''
          mkdir -p $out
          cp -r build/* $out/
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
