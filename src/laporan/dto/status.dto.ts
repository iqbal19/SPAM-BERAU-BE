import { IsNotEmpty, IsString } from 'class-validator'

export class StatusDto {
    @IsString()
    @IsNotEmpty()
	kategori: TypeLaporan

    @IsString()
    @IsNotEmpty()
	status: StatusLaporan
}

enum StatusLaporan {
	BAIK='BAIK',
	RUSAK='RUSAK',
	RUSAK_DIPERBAIKI='RUSAK_DIPERBAIKI'
}

export enum TypeLaporan {
	intake="intake",
	wtp="wtp",
	panel_intake="panel_intake",
	panel_distribusi="panel_distribusi",
	pompa_intake="pompa_intake",
	pompa_distribusi="pompa_distribusi",
	pipa_distribusi="pipa_distribusi",
	pipa_transmisi="pipa_transmisi"
}