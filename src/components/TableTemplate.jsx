import React, { useState } from 'react'
import { StyledTableCell, StyledTableRow } from './styles.jsx';
import { Table, TableBody, TableContainer, TableHead, TablePagination, Skeleton } from '@mui/material';

const TableTemplate = ({ buttonHaver: ButtonHaver, columns, rows, loading }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    return (
        <>
            <TableContainer>
                <Table stickyHeader aria-label="Data table" role="table">
                    <TableHead>
                        <StyledTableRow>
                            {columns.map((column) => (
                                <StyledTableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </StyledTableCell>
                            ))}
                            <StyledTableCell align="center">
                                Actions
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <StyledTableRow key={idx}>
                                    {columns.map((column, cidx) => (
                                        <StyledTableCell key={cidx} align={column.align}>
                                            <Skeleton variant="rectangular" height={24} />
                                        </StyledTableCell>
                                    ))}
                                    <StyledTableCell align="center">
                                        <Skeleton variant="circular" width={32} height={32} />
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <StyledTableRow hover role="row" tabIndex={0} key={row.id} aria-label={`Row for ${columns.map(c => row[c.id]).join(', ')}`}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <StyledTableCell key={column.id} align={column.align} role="cell">
                                                        {
                                                            column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value
                                                        }
                                                    </StyledTableCell>
                                                );
                                            })}
                                            <StyledTableCell align="center" role="cell">
                                                <ButtonHaver row={row} aria-label="Row actions" />
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 5));
                    setPage(0);
                }}
            />
        </>
    )
}

export default TableTemplate