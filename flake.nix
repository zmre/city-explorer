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
      lib = import <nixpkgs/lib>;
      pkgs = nixpkgs.legacyPackages.${system};
    in rec {
      packages = {
        city-explorer = {
          name = "city-explorer";
          version = "0.1.0";
          src = ./.;
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
            pkgs.jq
            pkgs.bun
            (pkgs.yarn-berry.override {nodejs = nodejs_22;})
            typescript
            typescript-language-server
            diagnostic-languageserver
            eslint_d
          ];
          nativeBuildInputs =
            []
            ++ lib.optionals pkgs.stdenv.isDarwin [pkgs.darwin.cctools];
        };
      };
      defaultPackage = packages.city-explorer;

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
